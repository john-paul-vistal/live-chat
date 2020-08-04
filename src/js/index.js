$(document).ready(function() {
    var userName;
    var avatarImg;

    $('.avatar-img').click(function() {
        let avatarChoosen = $(this).children().attr('src')
        $('#choosenAvatar').attr('src', avatarChoosen)
    })

    $('#strtConvo').click(function() {
        userName = $('#userName').val();
        avatarImg = $('#choosenAvatar').attr('src');
        if (userName != '') {
            localStorage.setItem("userName", userName);
            localStorage.setItem("avatarImg", avatarImg);
            location.replace("chat-body.html")
        } else {
            Swal.fire({
                position: 'top',
                icon: 'error',
                title: 'Oops...',
                text: 'PLEASE PUT A USER NAME',
            })
        }
    })
    console.log(localStorage.getItem("avatarImg"))
    $('#logout').click(function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will get disconnected to your conversation!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.value) {
                localStorage.removeItem("userName");
                localStorage.removeItem("avatarImg");
                location.replace("index.html")
            }
        })

    })

    var client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt')

    client.on('connect', function() {
        console.log('connected')
        client.subscribe('livechat/messages', function(err) {
            if (err) {
                console.log(err)
            }
        })
    })

    client.on('message', function(topic, message) {
        let payload = JSON.parse(message);
        if (payload.user == localStorage.getItem("userName")) {
            $('#chatBody').append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send messagepx">' + payload.message + '<span class="msg_time_send">' + payload.timestamp + '</span></div><div class="img_cont_msg"><img src="' + payload.avatar + '" class="rounded-circle user_img_msg"></div></div>')
        } else {
            $('#chatBody').append('<div class="d-flex justify-content-start mb-4"> <div class = "img_cont_msg" ><img src = "' + payload.avatar + '"class = "rounded-circle user_img_msg" ></div><div class = "msg_cotainer messagepx">' + payload.message + '<span class = "msg_time" >' + payload.timestamp + '</span></div></div>')
        }

    });


    $('#sendBtn').click(function() {
        let msg = $('#message').val();
        if (msg != '') {
            let timeStamp = new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString()
            let payload = {
                user: localStorage.getItem("userName"),
                avatar: localStorage.getItem("avatarImg"),
                timestamp: timeStamp,
                message: msg
            }
            client.publish('livechat/messages', JSON.stringify(payload));
            $('#message').val('');
        }
    })

}); //END CODE