function checkName(str) {
    var re = /^((?![\^!@#$*~ <>?]).)((?![\^!@#$*~<>?]).){0,73}((?![\^!@#$*~ <>?]).)$/;
    if (!re.test(str)) {
        $('#txt-name').focus();
        $('#error_label').text('Tên lớn hơn 1 ký tự!');
    } else {
        $('#error_label').text('');
    }
    return re.test(str);
}


function checkAddress(str) {
    var re = /^((?![\^!@#$*~ <>?]).)((?![\^!@#$*~<>?]).){0,73}((?![\^!@#$*~ <>?]).)$/;
    if (!re.test(str)) {
        $('#txt-address').focus();
        $('#error_label').text('Địa chỉ lớn hơn 3 ký tự!');
    } else {
        $('#error_label').text('');
    }
    return re.test(str);
}

function checkPhone(str) {
    var re = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;
    if (!re.test(str)) {
        $('#txt-phone').focus();
        $('#error_label').text('Số điện thoại không đúng!');
    } else {
        $('#error_label').text('');
    }
    return re.test(str);
}

function checkEmail(str) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(str)) {
        $('#txt-email').focus();
        $('#error_label').text('Email sai định dạng!');
    } else {
        $('#error_label').text('');
    }
    return re.test(str);
}
