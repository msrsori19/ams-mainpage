$(document).ready(function() {
    $(".form-newsletter").on("submit", function(e) {
        e.preventDefault();

        var email = $(this).find("input[name='email']").val();
        var $messageDiv = $(this).find(".response-message");
        var successMessage = $(this).data('success'); // "리앙에 등록해주셔서 감사합니다."
        var errorMessage = $(this).data('error');     // "올바른 이메일 형식을 입력해주세요."
        var duplicateEmailMessage = $(this).data('error2'); // "이미 등록된 이메일입니다."

        if (!isValidEmail(email)) {
            $messageDiv.text(errorMessage);  // 유효하지 않은 이메일 형식 메시지 출력
            fadeMessage($messageDiv);
            return;
        }

        $.ajax({
            type: "GET",
            url: "https://testapi.saveart.xyz/emailSubscription/email_subscriptions",
            data: { email: email },
            success: function(response) {
                if (response.exists) {
                    $messageDiv.text(duplicateEmailMessage); // 중복 이메일 메시지 출력
                    fadeMessage($messageDiv);
                } else {
                    saveEmail(email, $messageDiv, successMessage, errorMessage);
                }
            },
            error: function(error) {
                $messageDiv.text(errorMessage);  // 에러 발생시 메시지 출력
                fadeMessage($messageDiv);
            }
        });
    });
});

function isValidEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function saveEmail(email, $messageDiv, successMessage, errorMessage) {
    $.ajax({
        type: "POST",
        url: "https://testapi.saveart.xyz/emailSubscription/email_subscriptions",
        data: JSON.stringify({ email: email }),
        contentType: "application/json",
        success: function(response) {
            $messageDiv.text(successMessage); // 성공 메시지 출력
            $(".form-newsletter input[name='email']").val('');
            fadeMessage($messageDiv);
        },
        error: function(error) {
            $messageDiv.text(errorMessage);  // 에러 발생시 메시지 출력
            fadeMessage($messageDiv);
        }
    });
}

function fadeMessage($messageDiv) {
    setTimeout(function() {
        $messageDiv.fadeOut(1000, function() {
            $messageDiv.text('').show();
        });
    }, 3000);
}

///email
//Get URL = https://testapi.saveart.xyz/emailSubscription/email_subscriptions
//Post URL = https://testapi.saveart.xyz/emailSubscription/email_subscriptions
// 1. 이메일 형식체크
// 2. 이메일 중복체크
// 3. 이메일 저장
// 4. 이메일 저장 성공시 메세지 출력
// 5. 이메일 저장 실패시 메세지 출력
// 6. 이메일 저장 성공시 이메일 입력창 초기화
// 7. 이메일 저장 실패시 이메일 입력창 초기화
// 8. 출력된 메세지 3초 후 사라짐