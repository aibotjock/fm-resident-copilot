package org.fmresidentcopilot.preview;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.content.res.ColorStateList;
import android.graphics.Insets;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Base64;
import android.view.View;
import android.view.WindowInsets;
import android.view.Gravity;
import android.webkit.*;
import android.widget.*;
import org.json.JSONObject;
import java.io.OutputStream;
import java.util.Locale;

/** Thin Android host for the existing app. No API keys or shared access code are embedded. */
public final class MainActivity extends Activity {
  private WebView web;
  private LinearLayout unavailable;
  private TextView unavailableTitle,unavailableMessage;
  private boolean pageLoadFailed;
  private TextToSpeech tts;
  private PermissionRequest microphone;
  private ValueCallback<Uri[]> fileChoice;
  private byte[] exportBytes;
  private volatile String currentUtterance;
  private int speechSequence;
  private static final int MIC=10, PICK=11, EXPORT=12;
  private boolean trusted(String raw) {
    try { Uri u=Uri.parse(raw),base=Uri.parse(BuildConfig.BASE_URL);return "https".equals(u.getScheme())&&base.getHost().equals(u.getHost())&&(u.getPort()==-1||u.getPort()==443); }
    catch(Exception e){return false;}
  }
  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(Color.rgb(15,23,42));
    // Target 35 draws behind system bars. Explicitly inset all interactive content.
    if(Build.VERSION.SDK_INT>=30)getWindow().setDecorFitsSystemWindows(false);
    else root.setFitsSystemWindows(true);
    root.setOnApplyWindowInsetsListener((view,insets)->{
      if(Build.VERSION.SDK_INT>=30){
        Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());
        Insets keyboard=insets.getInsets(WindowInsets.Type.ime());
        view.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,keyboard.bottom));
        return WindowInsets.CONSUMED;
      }
      return insets;
    });
    LinearLayout bar=new LinearLayout(this);bar.setGravity(Gravity.CENTER_VERTICAL);bar.setPadding(dp(3),dp(4),dp(3),dp(4));
    addButton(bar,"Study",()->open("/"));addButton(bar,"Tutor",()->open("/tutor"));addButton(bar,"Backup",()->backup());addButton(bar,"Reload",()->retry());
    root.addView(bar,new LinearLayout.LayoutParams(-1,dp(56)));
    FrameLayout content=new FrameLayout(this);root.addView(content,new LinearLayout.LayoutParams(-1,0,1));
    web=new WebView(this);content.addView(web,new FrameLayout.LayoutParams(-1,-1));
    unavailable=new LinearLayout(this);unavailable.setOrientation(LinearLayout.VERTICAL);unavailable.setGravity(Gravity.CENTER_VERTICAL);unavailable.setPadding(dp(24),dp(24),dp(24),dp(24));unavailable.setBackgroundColor(Color.rgb(15,23,42));unavailable.setVisibility(View.GONE);
    unavailableTitle=new TextView(this);unavailableTitle.setTextSize(25);unavailableTitle.setTextColor(Color.WHITE);unavailable.addView(unavailableTitle);
    unavailableMessage=new TextView(this);unavailableMessage.setTextSize(17);unavailableMessage.setTextColor(Color.rgb(203,213,225));unavailableMessage.setPadding(0,dp(16),0,dp(24));unavailable.addView(unavailableMessage);
    Button retry=new Button(this);retry.setText("Retry connection");retry.setAllCaps(false);retry.setOnClickListener(v->retry());unavailable.addView(retry,new LinearLayout.LayoutParams(-1,dp(52)));
    content.addView(unavailable,new FrameLayout.LayoutParams(-1,-1));setContentView(root);root.post(()->{
      root.requestApplyInsets();
      if(Build.VERSION.SDK_INT>=30&&getWindow().getInsetsController()!=null)getWindow().getInsetsController().setSystemBarsAppearance(0,android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS|android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
    });
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    WebView.setWebContentsDebuggingEnabled(false);
    WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setMediaPlaybackRequiresUserGesture(false);settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setSupportMultipleWindows(true);settings.setSafeBrowsingEnabled(true);
    CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
    web.addJavascriptInterface(new Bridge(),"FMAndroid");
    web.setWebViewClient(new WebViewClient(){
      @Override public void onPageStarted(WebView v,String url,android.graphics.Bitmap favicon){pageLoadFailed=false;unavailable.setVisibility(View.GONE);}
      @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){
        String url=r.getUrl().toString();if(trusted(url))return false;
        if("https".equals(r.getUrl().getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,r.getUrl()));}catch(Exception ignored){}}
        return true;
      }
      @Override public void onPageFinished(WebView v,String url){
        if(!trusted(url)||pageLoadFailed)return;
        v.evaluateJavascript("window.FM_NATIVE_ANDROID=true;",null);
        CookieManager.getInstance().flush();
      }
      @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError error){if(r.isForMainFrame()){
        showUnavailable("Connection unavailable","FM Copilot could not reach its app service. Check your connection and try again. Your saved study data has not been cleared.");
      }}
      @Override public void onReceivedHttpError(WebView v,WebResourceRequest request,WebResourceResponse response){if(request.isForMainFrame()){
        int status=response.getStatusCode();
        showUnavailable(status==404?"Preview service not ready":"App service unavailable",status==404?"The preview backend has not started, or this page is not available yet. It needs to be activated before the app can connect. You do not need to change your phone's network settings. Tap Retry after activation.":"The app service returned an error ("+status+"). Please retry shortly. Your saved study data has not been cleared.");
      }}
      @Override public void onReceivedSslError(WebView v,android.webkit.SslErrorHandler h,android.net.http.SslError e){h.cancel();showUnavailable("Secure connection unavailable","The app could not verify the server's secure connection. Retry later; connection verification has not been disabled.");}
    });
    web.setWebChromeClient(new WebChromeClient(){
      @Override public void onPermissionRequest(PermissionRequest request){runOnUiThread(()->{
        if(!trusted(request.getOrigin().toString())){request.deny();return;}
        boolean audio=false;for(String resource:request.getResources())if(PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource))audio=true;
        if(!audio){request.deny();return;}
        if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        else{if(microphone!=null)microphone.deny();microphone=request;requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},MIC);}
      });}
      @Override public void onPermissionRequestCanceled(PermissionRequest request){if(microphone==request)microphone=null;}
      @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean gesture,android.os.Message message){
        if(!gesture)return false;
        WebView temporary=new WebView(MainActivity.this);temporary.setWebViewClient(new WebViewClient(){
          @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest request){Uri target=request.getUrl();if("https".equals(target.getScheme())){if(trusted(target.toString()))web.loadUrl(target.toString());else try{startActivity(new Intent(Intent.ACTION_VIEW,target));}catch(Exception ignored){}}v.destroy();return true;}
        });((WebView.WebViewTransport)message.obj).setWebView(temporary);message.sendToTarget();return true;
      }
      @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
        if(fileChoice!=null)fileChoice.onReceiveValue(null);fileChoice=callback;
        Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);intent.setType("application/json");intent.addCategory(Intent.CATEGORY_OPENABLE);
        try{startActivityForResult(intent,PICK);return true;}catch(Exception e){fileChoice=null;return false;}
      }
    });
    web.setDownloadListener((url,userAgent,contentDisposition,mime,length)->{
      if(url.startsWith("blob:"+BuildConfig.BASE_URL))web.evaluateJavascript("fetch("+JSONObject.quote(url)+").then(r=>r.blob()).then(b=>{const f=new FileReader();f.onload=()=>FMAndroid.exportFile(String(f.result).split(',')[1],'fm-copilot-progress.json');f.readAsDataURL(b);})",null);
      else if(trusted(url))startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));
    });
    tts=new TextToSpeech(this,status->{if(status==TextToSpeech.SUCCESS)tts.setLanguage(Locale.US);});
    tts.setOnUtteranceProgressListener(new UtteranceProgressListener(){
      @Override public void onStart(String id){}
      @Override public void onDone(String id){speechFinished(id);}
      @Override public void onError(String id){speechFinished(id);}
    });
    if(state!=null)web.restoreState(state);else open("/tutor");
  }
  private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
  private void showUnavailable(String title,String message){runOnUiThread(()->{pageLoadFailed=true;unavailableTitle.setText(title);unavailableMessage.setText(message);unavailable.setVisibility(View.VISIBLE);});}
  private void retry(){String url=web.getUrl();if(url==null||!trusted(url))url=BuildConfig.BASE_URL+"/tutor";web.loadUrl(url);}
  private void addButton(LinearLayout bar,String text,Runnable action){Button button=new Button(this);button.setText(text);button.setAllCaps(false);button.setTextSize(14);button.setTextColor(Color.WHITE);button.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(30,41,59)));button.setMinWidth(0);button.setMinimumWidth(0);button.setMinHeight(dp(44));button.setPadding(dp(2),0,dp(2),0);button.setOnClickListener(v->action.run());LinearLayout.LayoutParams size=new LinearLayout.LayoutParams(0,-1,1);size.setMargins(dp(2),0,dp(2),0);bar.addView(button,size);}
  private void open(String path){if(web!=null){web.evaluateJavascript("window.dispatchEvent(new Event('pagehide'));",null);web.loadUrl(BuildConfig.BASE_URL+path);}}
  private void backup(){if(!trusted(web.getUrl()))return;web.evaluateJavascript("(()=>{const data={format:'fm-copilot-device-backup-v1',storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('@fm_copilot_')||k.startsWith('fm-tutor-progress'))data.storage[k]=localStorage.getItem(k);}FMAndroid.exportFile(btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2)))),'fm-copilot-device-backup.json');})()",null);}
  private void speechFinished(String id){if(id!=null&&id.equals(currentUtterance)){currentUtterance=null;runOnUiThread(()->{if(!isFinishing())web.evaluateJavascript("window.dispatchEvent(new Event('fm-native-speech-ended'));",null);});}}
  final class Bridge {
    @JavascriptInterface public void speak(String text){if(text==null||text.length()>30000)return;runOnUiThread(()->{if(trusted(web.getUrl())&&tts!=null){
      tts.stop();java.util.ArrayList<String> chunks=new java.util.ArrayList<>();String rest=text.trim();while(rest.length()>3500){int boundary=rest.lastIndexOf(' ',3500);if(boundary<1750)boundary=3500;chunks.add(rest.substring(0,boundary));rest=rest.substring(boundary).trim();}if(!rest.isEmpty())chunks.add(rest);
      String prefix="fm-"+(++speechSequence)+"-";currentUtterance=prefix+"last";for(int i=0;i<chunks.size();i++)tts.speak(chunks.get(i),TextToSpeech.QUEUE_ADD,null,i==chunks.size()-1?currentUtterance:prefix+i);
    }});}
    @JavascriptInterface public void stop(){runOnUiThread(()->{if(tts!=null)tts.stop();speechFinished(currentUtterance);});}
    @JavascriptInterface public void exportFile(String base64,String filename){runOnUiThread(()->{
      if(!trusted(web.getUrl())||base64==null||base64.length()>4000000)return;
      try{byte[] bytes=Base64.decode(base64,Base64.DEFAULT);new JSONObject(new String(bytes,"UTF-8"));exportBytes=bytes;Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT);i.setType("application/json");i.addCategory(Intent.CATEGORY_OPENABLE);i.putExtra(Intent.EXTRA_TITLE,"fm-copilot-progress.json");startActivityForResult(i,EXPORT);}catch(Exception e){Toast.makeText(MainActivity.this,"Could not export this progress file",Toast.LENGTH_LONG).show();}
    });}
  }
  @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] grants){super.onRequestPermissionsResult(request,permissions,grants);if(request==MIC&&microphone!=null){if(grants.length>0&&grants[0]==PackageManager.PERMISSION_GRANTED)microphone.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});else microphone.deny();microphone=null;}}
  @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request==PICK&&fileChoice!=null){fileChoice.onReceiveValue(result==RESULT_OK&&data!=null?new Uri[]{data.getData()}:null);fileChoice=null;}if(request==EXPORT&&result==RESULT_OK&&data!=null&&exportBytes!=null){try(OutputStream out=getContentResolver().openOutputStream(data.getData())){out.write(exportBytes);Toast.makeText(this,"Progress exported",Toast.LENGTH_SHORT).show();}catch(Exception e){Toast.makeText(this,"Export failed",Toast.LENGTH_LONG).show();}finally{exportBytes=null;}}}
  @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
  @Override protected void onSaveInstanceState(Bundle state){web.saveState(state);super.onSaveInstanceState(state);}
  @Override protected void onPause(){web.evaluateJavascript("window.dispatchEvent(new Event('pagehide'));",null);if(tts!=null)tts.stop();web.onPause();super.onPause();}
  @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
  @Override protected void onDestroy(){if(microphone!=null)microphone.deny();if(tts!=null){tts.stop();tts.shutdown();}web.destroy();super.onDestroy();}
}
