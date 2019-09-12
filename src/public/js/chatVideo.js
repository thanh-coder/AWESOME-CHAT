function videoChat(divId){
    $(`#video-chat-${divId}`).unbind("click").on("click", function(){
        let targetId =  $(this).data("chat");
        let callerName = $("#navbar-username").text();
        console.log(targetId,callerName)

        let dataToEmit = {
            listenerId: targetId,
            callerName
        }

        socket.emit("caller-check-listener-online-or-not", dataToEmit);
    })
}

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function(){
        video.play();
    }
}

function closeVideoStream(stream){
    return stream.getTracks().forEach(track => track.stop())
}

$(document).ready(function(){
    socket.on("server-send-listener-is-offline", function(){
        alertify.notify("nguoi dung nay hien khong truc tuyen","error",7);
    })
    let getPerrId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        debug: 3
    });
    peer.on("open",function(peerId){
        getPerrId = peerId;
        console.log(getPerrId);
    })

    // step 4 of listener
    socket.on("server-request-peer-id-of-listener", function(response){
        console.log("step 4:",response);
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPerrId
        }
        socket.emit("listener-emit-peer-id-to-server", dataToEmit)
    })

    let timeInterval;
//step 5 of caller
    socket.on("server-send-peer-id-of-listener-to-caller",function(response){
        console.log("step 5:",response);        
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }
        socket.emit("caller-request-call-to-server", dataToEmit)
        Swal.fire({
            title: `dang goi cho  &nbsp; <span style="color:#2ecc71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html: `thoi gian <strong> style="color:#2ecc71 </strong> giay. <br/>
            <button id="btn-cancel-call" class="btn btn-danger">
            huy cuoc goi
            </button>
            `,
            backdrop:"rgba(85,85,85,0.4)",
            width:"52rem",
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit)
                })
                if(Swal.getContent().querySelector!==null){
                    Swal.showLoading();
                    timeInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
                    },1000)
                }
            },
            onOpen: () => {
                //step 12 of caller
                socket.on("server-send-reject-call-to-caller", function(response){
                    Swal.close();
                    clearInterval(timeInterval);
                    Swal.fire({
                        type:"info",
                        title:`<span style="color: #2ecc71">${response.listenerName}</span> &nbsp; hien tai khong the nghe may`,
                        backdrop:"rgba(85,85,85,0.4)",
                        width:"52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, confirm it!'
                    })
                });
                //step 13 of caller
               
            },
            onClose : () => {
                clearInterval(timeInterval);
            }
          }).then(result => {
              
          })
    })

// step 08 of listener 
    socket.on("server-send-request-call-to-listener",function(response){
        console.log("step 8:",response);
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }
        Swal.fire({
            title: ` <span style="color:#2ecc71">${response.callerName}</span> &nbsp;muon tro chuyen video voi ban <i class="fa fa-volume-control-phone"></i>`,
            html: `thoi gian <strong> style="color:#2ecc71 </strong> giay. <br/>
            <button id="btn-reject-call" class="btn btn-danger">
            huy cuoc goi
            </button>
            <button id="btn-accept-call" class="btn btn-success">
              dong y
            </button>
            `,
            backdrop:"rgba(85,85,85,0.4)",
            width:"52rem",
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);
                    // step 10 of listener 
                    socket.emit("listener-reject-request-call-to-server", dataToEmit)
                })

                $("#btn-accept-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);
                    // step 11 of listener 
                    socket.emit("listener-accept-request-call-to-server", dataToEmit)
                })
                if(Swal.getContent().querySelector!==null){
                    Swal.showLoading();
                    timeInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
                    },1000)
                }
            },
            onOpen: ()=>{
                // lang nghe steo 9 of listener
                socket.on("server-send-cancel-request-call-to-listener", function(response){
                    Swal.close();
                    clearInterval(timeInterval);
                })
            },
            onClose : () => {
                clearInterval(timeInterval);
            }
          }).then(result => {
              
          })
    });
     //step 13 of caller
     socket.on("server-send-accept-call-to-caller", function(response){
        Swal.close();
        clearInterval(timeInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({video: true, audio: true}, function(stream) {
            $("#streamModal").modal("show");
            playVideoStream("local-stream", stream);
            let call = peer.call(response.listenerPeerId, stream);
            call.on('stream', function(remoteStream) {
               playVideoStream("remote-stream", remoteStream);
            });
            $("#streamModal").on("hidden.bs.modal", function(){
                closeVideoStream(stream);
                Swal.fire({
                    type:"info",
                    title:`da ket thuc cuoc goi voi <span style="color: #2ecc71">${response.listenerName}</span> &nbsp;`,
                    backdrop:"rgba(85,85,85,0.4)",
                    width:"52rem",
                    allowOutsideClick: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, confirm it!'
                });
            })
          }, function(err) {
            if(err.toString() === "NotAllowedError: Permission denied"){
                alertify.notify("xin loi ban da tat quyen truy cap micro","error",7)
            }   
            if(err.toString() === "NotFoundError: Request device not found "){
                alertify.notify("xin loi chung toi khong tim thay thiet bi nghe goi tren may tinh cua ban","error",7)
            }       
        });
    });

     //step 14 of listener
     socket.on("server-send-accept-call-to-listener", function(response){
        Swal.close();
        clearInterval(timeInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function(call) {
            console.log("call:",call)
            getUserMedia({video: true, audio: true}, function(stream) {
                $("#streamModal").modal("show");
              playVideoStream("local-stream", stream);
              call.answer(stream); // Answer the call with an A/V stream.
              call.on('stream', function(remoteStream) {
                playVideoStream("remote-stream", remoteStream);
              });
              $("#streamModal").on("hidden.bs.modal", function(){
                    closeVideoStream(stream);
                    Swal.fire({
                        type:"info",
                        title:`da ket thuc cuoc goi voi <span style="color: #2ecc71">${response.callerName}</span> &nbsp; `,
                        backdrop:"rgba(85,85,85,0.4)",
                        width:"52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Yes, confirm it!'
                    })
              });
            }, function(err) {
                if(err.toString() === "NotAllowedError: Permission denied"){
                    alertify.notify("xin loi ban da tat quyen truy cap micro","error",7)
                }
                if(err.toString() === "NotFoundError: Request device not found "){
                    alertify.notify("xin loi chung toi khong tim thay thiet bi nghe goi tren may tinh cua ban","error",7)
                } 
            });
          });
    });
});
