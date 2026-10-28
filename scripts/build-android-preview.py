#!/usr/bin/env python3
"""Build a signed Android preview with Android SDK tools; no Expo/EAS account required.

ANDROID_SDK_ROOT and FM_ANDROID_BASE_URL are required. Signing state is private,
gitignored, and reused on subsequent builds. No API credential enters this build.
"""
import os, pathlib, subprocess, shutil, secrets, zipfile, json, urllib.parse

root = pathlib.Path(__file__).resolve().parents[1]
sdk = pathlib.Path(os.environ['ANDROID_SDK_ROOT'])
base = os.environ['FM_ANDROID_BASE_URL'].rstrip('/')
version_code = os.environ.get('FM_ANDROID_VERSION_CODE','20261029')
version_name = os.environ.get('FM_ANDROID_VERSION_NAME','1.1.1-preview')
if not version_code.isdigit():
    raise SystemExit('FM_ANDROID_VERSION_CODE must be a positive integer')
url = urllib.parse.urlsplit(base)
if url.scheme != 'https' or not url.hostname or url.username or url.password or url.path or url.query or url.fragment:
    raise SystemExit('FM_ANDROID_BASE_URL must be a plain HTTPS origin')
tools = sdk/'build-tools'/'35.0.0'
jar = sdk/'platforms'/'android-35'/'android.jar'
build = root/'android-preview'/'build'
signing = root/'android-preview'/'.signing'
for directory in [build,signing,build/'res'/'drawable',build/'generated',build/'classes',build/'dex']:
    directory.mkdir(parents=True,exist_ok=True)
shutil.copyfile(root/'artifacts/mobile/assets/images/icon.png',build/'res/drawable/icon.png')
generated = build/'generated/org/fmresidentcopilot/preview'
generated.mkdir(parents=True,exist_ok=True)
(generated/'BuildConfig.java').write_text('package org.fmresidentcopilot.preview; public final class BuildConfig { public static final String BASE_URL = '+json.dumps(base)+'; }\n')
def run(args,env=None):
    subprocess.run([str(a) for a in args],check=True,env=env)
run([tools/'aapt','package','-f','-M',root/'android-preview/AndroidManifest.xml','-S',build/'res','-I',jar,'-F',build/'resources.ap_','-J',build/'generated','--version-code',version_code,'--version-name',version_name])
sources=list((root/'android-preview/src').rglob('*.java'))+list((build/'generated').rglob('*.java'))
run(['javac','-encoding','UTF-8','-source','8','-target','8','-classpath',jar,'-d',build/'classes',*sources])
run([tools/'d8','--lib',jar,'--min-api','26','--output',build/'dex',*list((build/'classes').rglob('*.class'))])
shutil.copyfile(build/'resources.ap_',build/'unsigned.apk')
with zipfile.ZipFile(build/'unsigned.apk','a',compression=zipfile.ZIP_DEFLATED) as apk:
    for dex in (build/'dex').glob('*.dex'): apk.write(dex,dex.name)
run([tools/'zipalign','-f','-p','4',build/'unsigned.apk',build/'aligned.apk'])
password_file=signing/'password'
if not password_file.exists():
    password_file.write_text(secrets.token_urlsafe(32));password_file.chmod(0o600)
env=dict(os.environ,FM_PREVIEW_SIGN_PASSWORD=password_file.read_text())
keystore=signing/'preview.jks'
if not keystore.exists():
    run(['keytool','-genkeypair','-keystore',keystore,'-storepass:env','FM_PREVIEW_SIGN_PASSWORD','-keypass:env','FM_PREVIEW_SIGN_PASSWORD','-alias','fm-preview','-keyalg','RSA','-keysize','3072','-validity','10000','-dname','CN=FM Copilot Preview, O=FM Resident Copilot, C=US'],env)
out=build/'FM-Copilot-Preview.apk'
run([tools/'apksigner','sign','--ks',keystore,'--ks-key-alias','fm-preview','--ks-pass','env:FM_PREVIEW_SIGN_PASSWORD','--key-pass','env:FM_PREVIEW_SIGN_PASSWORD','--out',out,build/'aligned.apk'],env)
run([tools/'apksigner','verify','--verbose','--print-certs',out])
run([tools/'aapt','dump','badging',out])
print(out)
