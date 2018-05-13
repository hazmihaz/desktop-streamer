require('dotenv').config()

const {app, BrowserWindow, ipcMain} = require('electron')
  const path = require('path')
  const url = require('url')
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 960, height: 600})
  
    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    // Open the DevTools.
    win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

// var ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");
// //var fs = require("fs");
// //var testData = new Uint8Array(fs.readFileSync("test.mp4"));
  
// var stdout = "";
//   var stderr = "";
//   // Print FFmpeg's version.
//   var result = ffmpeg({
//     mounts: [{type: "NODEFS", opts: {root: "."}, mountpoint: "/v"}],
//     arguments: ['-i', '/v/test.mp4',
//                 // '-vn', '-ar 44100',
//                 // '-ac', '2',
//                 // '-ab', '128k',
//                 // '-f', 'mp3',
//                 "-c:v", "libvpx", 
//                 "-an",
//                 '/v/output1.mp4'],
//     stdin: function() {},
//     print: function(data) { stdout += data + "\n"; },
//     printErr: function(data) { stderr += data + "\n"; },
//     onExit: function(code) {
//       console.log("Process exited with code " + code);
//       console.log(stdout);
//     },
//   });

  // var out = result.MEMFS[0];
  // fs.writeFileSync(out.name, Buffer(out.data));

var ffmpeg = require('fluent-ffmpeg')
var command = null

ipcMain.on('ping', (evt, arg) => {
  console.log(arg)
  evt.sender.send('pong', 'hae')
})

ipcMain.on('start', (evt, arg) => {
  const { key } = arg
  const view = evt.sender

  command = ffmpeg('test.mp4')
                  .inputFormat('dshow')
                  .inputOptions(
                    '-i', 'video=USB Camera:audio=Microphone (Conexant SmartAudio HD)',
                  )
                  .outputOptions(
                    '-c:a', 'aac',
                    '-ar', '44100',
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    '-preset', 'ultrafast',
                    // '-g', '20',
                    //'-b:v', '2500k',
                    // '-threads', '0',
                    // '-bufsize', '512k',
                  )
                  .format('flv')
                  //.output('rtmp://a.rtmp.youtube.com/live2/' + key)
                  //.stream('rtmp://a.rtmp.youtube.com/live2/' + key)
                  .save('rtmp://a.rtmp.youtube.com/live2/' + key)
                  // .on('start', function(){
                  //   ipcMain.on('stop', function(){
                  //     command.kill()
                  //   })
                  // })
                  .on('stderr', function(stderrLine) {
                    console.log('Stderr output: ' + stderrLine);
                    view.send('message', 'Stderr output: ' + stderrLine)
                  })
                  .on('error', function(err, stdout, stderr) {
                    console.log('Stop process video: ' + err.message);
                    view.send('message', 'Stop process video: ' + err.message)
                  })
                  .on('end', function() {
                    console.log('Processing finished !');
                    view.send('message', 'Processing finished !')
                  })
                  //.run()

  ipcMain.on('stop', () => {
    console.log('stop')
    command.kill()
  })
})


// var ffmpeg = require('fluent-ffmpeg')
//   var command = ffmpeg('test.mp4')
//                     .inputFormat('dshow')
//                     .inputOptions(
//                       '-i', 'video=USB Camera:audio=Microphone (Conexant SmartAudio HD)',
//                     )
//                     .outputOptions(
//                       '-c:a', 'aac',
//                       '-ar', '44100',
//                       '-c:v', 'libx264',
//                       '-pix_fmt', 'yuv420p',
//                       '-preset', 'ultrafast',
//                       // '-g', '20',
//                       //'-b:v', '2500k',
//                       // '-threads', '0',
//                       // '-bufsize', '512k',
//                     )
//                     .format('flv')
//                     .output('rtmp://a.rtmp.youtube.com/live2/wyau-k694-sfcr-0pdk')
//                     .on('stderr', function(stderrLine) {
//                       console.log('Stderr output: ' + stderrLine);
//                     })
//                     .on('error', function(err, stdout, stderr) {
//                       console.log('Cannot process video: ' + err.message);
//                     })
//                     .on('end', function() {
//                       console.log('Processing finished !');
//                     })
//                     .run()
