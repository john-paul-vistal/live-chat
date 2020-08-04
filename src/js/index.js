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
        $('#body').css('display', 'block');
        $('#login').css('display', 'none');
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
        if (payload.user == userName) {
            $('#chatBody').append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send messagepx">' + payload.message + '<span class="msg_time_send">' + payload.timestamp + '</span></div><div class="img_cont_msg"><img src="' + payload.avatar + '" class="rounded-circle user_img_msg"></div></div>')
        } else {
            $('#cahtBody').append('<div class="d-flex justify-content-start mb-4"> <div class = "img_cont_msg" ><img src = "' + payload.avatar + '"class = "rounded-circle user_img_msg" ></div><div class = "msg_cotainer messagepx">' + payload.message + '<span class = "msg_time" >' + payload.timestamp + '</span></div></div>')
        }

    });


    $('#sendBtn').click(function() {
        let msg = $('#message').val();
        let timeStamp = new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString()
        let payload = {
            user: userName,
            avatar: avatarImg,
            timestamp: timeStamp,
            message: msg
        }
        client.publish('livechat/messages', JSON.stringify(payload));
    })

}); //END CODE