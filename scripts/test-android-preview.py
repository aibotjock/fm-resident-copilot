#!/usr/bin/env python3
"""Optional emulator install/launch check. Does not test clinical truth or real microphones."""
import os,subprocess,time,pathlib,json
root=pathlib.Path(__file__).resolve().parents[1]
sdk=pathlib.Path(os.environ['ANDROID_SDK_ROOT'])
adb=sdk/'platform-tools/adb'
report={'device':'Android 35 x86_64 software emulator','clinicalReview':False,'checks':[]}
log=open('/workspace/scratch/84fbc55c1389/android-tools/emulator-check.log','w')
process=subprocess.Popen([str(sdk/'emulator/emulator'),'-avd','fm-preview-test','-read-only','-no-window','-no-audio','-no-snapshot','-no-boot-anim','-gpu','swiftshader_indirect','-accel','off','-memory','2048','-ports','5556,5557'],stdout=log,stderr=log)
def command(*args,timeout=20):
    return subprocess.run([str(adb),'-s','emulator-5556',*args],text=True,capture_output=True,timeout=timeout)
try:
    deadline=time.monotonic()+240
    booted=False
    while time.monotonic()<deadline and process.poll() is None:
        try:
            result=command('shell','getprop','sys.boot_completed',timeout=5)
            if result.stdout.strip()=='1':booted=True;break
        except subprocess.TimeoutExpired:pass
        time.sleep(3)
    if not booted:report['status']='emulator_boot_not_completed';report['limitation']='No install or device interaction pass is claimed.'
    else:
        report['checks'].append('Emulator boot completed')
        installed=command('install','-r',str(root/'android-preview/build/FM-Copilot-Preview.apk'),timeout=90)
        report['installOutput']=installed.stdout.strip()
        if installed.returncode:raise RuntimeError('APK installation failed')
        report['checks'].append('Signed APK installed')
        launch=command('shell','am','start','-W','-n','org.fmresidentcopilot.preview/.MainActivity',timeout=40)
        if launch.returncode or 'Error:' in launch.stdout:raise RuntimeError('Activity launch failed')
        report['checks'].append('Main activity launched')
        time.sleep(8)
        crash=command('logcat','-d','-b','crash',timeout=15)
        report['appCrashObserved']='org.fmresidentcopilot.preview' in crash.stdout
        if report['appCrashObserved']:raise RuntimeError('App crash observed')
        report['checks'].append('No app crash observed after launch')
        report['status']='install_launch_passed'
        report['limitation']='Backend activation, real microphone capture, interruption timing and clinical content require separate checks.'
except Exception as error:report['status']='failed';report['error']=str(error)
finally:
    try:command('emu','kill',timeout=5)
    except Exception:pass
    process.terminate()
    try:process.wait(timeout=10)
    except subprocess.TimeoutExpired:process.kill()
    print(json.dumps(report,indent=2))
