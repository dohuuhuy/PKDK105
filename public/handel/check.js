function checkAuctionName() {
    var str = $("#noidungdv").val();
    if (str == "") {
        $('#error_customerName').text('Nội dung không được rỗng');
    } else {
        $('#error_customerName').text('');
        $("#formform").submit();
    }
    return re.test(str);
}
function capnhapck() {
    var khoa = $("#selectck").val()
    if (khoa == 0) {
        document.getElementById("thongbao").innerHTML = "Mời bạn chọn khoa";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        var str = $("#noidungck").val();
        if (str == "") {
            document.getElementById("thongbao").innerHTML = "Nội dung không được rỗng";
            $('.cd-popup').addClass('is-visible');
        } else {

            $("#formdv").submit();
        }
    }

    return re.test(str);
}
function capnhatgioithieu() {
    var str = $("#noidunggt").val();
    if (str == "") {
        document.getElementById("thongbao").innerHTML = "Nội dung không được rỗng";
        $('.cd-popup').addClass('is-visible');
    } else {
        $('#error_customerName').text('');

        var avtgt = $("#avtgt").val();
        var videogt = $("#videogt").val();
        if (avtgt !== "" && videogt !== "") {
            document.getElementById("thongbao").innerHTML = "Chỉ được chọn ảnh hoặc video";
            $('.cd-popup').addClass('is-visible');
        }
        else

            if (avtgt == "" && videogt == "") {
                document.getElementById("thongbao").innerHTML = "Mời bạn chọn ảnh hoặc video";
                $('.cd-popup').addClass('is-visible');
            }
            else {
                $("#formgioithieu").submit();
            }

    }
    return re.test(str);
}
function baivietbacsi() {
    var tenbs = $("#tenbs").val();
    var avt = $("#anhdaidienbs").val();
    var chuyenkhoa = $("#selectckbs").val();
    var chucvu = $("#chucvu").val();
    if (tenbs == "" || avt == "" || chucvu == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        $("#formbacsi").submit();
    }

}
function luutrangthietbi() {
    var checkfile = $("#file-input").val();
    var noidung = $("#text").val();
    if (noidung != "") {
        if (checkfile != "") {
            if (a >= 4) {
                document.getElementById("luu").action = "/themthietbi";
                $("#luu").submit();
            }
            else {
                document.getElementById("thongbao").innerHTML = "Mời bạn chọn đủ 4 ảnh";
                $('.cd-popup').addClass('is-visible');
            }
        }
        else {
            document.getElementById("luu").enctype="";
            document.getElementById("luu").action = "/themthietbikfile";
            $("#luu").submit();
        }
    }
    else {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }

}
function dieuchinhtintuc() {
    var tieude = $("#tieude").val();
    var avt = $("#anhdaidienbs").val();
    var noidung = $("#noidungtintuc").val();
    var tacgia = $("#tacgia").val();
    if (tieude == "" || noidung == "" || tacgia == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        $("#dieuchinhtintuc").submit();
    }

}
function dieuchinhbacsi() {
    var tenbs = $("#tenbs").val();
    var chuyenkhoa = $("#selectckbs").val();
    var chucvu = $("#chucvu").val();
    if (tenbs == "" || chuyenkhoa == "" || chucvu == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        $("#dieuchinhbacsi").submit();
    }
}
function luudichvu() {
    var tendv = $("#tendv").val();
    var mota = $("#mota").val();
    if (tendv == "" || mota == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        $("#themdichvu").submit();
    }
}
function dangnhap() {
    var tendn = document.getElementById("tendn").value;
    var pass = document.getElementById("pass").value;
    if (tendn == "" || pass == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn nhập đầy đủ thông tin";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        $("#formdangnhap").submit();
    }

}
function luubanner() {
    var file = document.getElementById("banner")
    if (file.value == "") {
        document.getElementById("thongbao").innerHTML = "Mời bạn chọn file";
        $('.cd-popup').addClass('is-visible');
    }
    else {
        var filePath = file.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(filePath)) {
            document.getElementById("thongbao").innerHTML = "Vui lòng upload các file có định dạng: .jpeg/.jpg/.png/.gif";
            $('.cd-popup').addClass('is-visible');

        }
        else {
            $("#thembanner").submit()
        }
    }
}
function capnhattaikhoan()
{
   var user= document.getElementById("user").value;
   var pass= document.getElementById("pass").value;
   if(user==""|| pass=="")
   {
    document.getElementById("thongbao").innerHTML = "Vui lòng nhập đầy đủ thông tin";
    $('.cd-popup').addClass('is-visible');
   }
   else
   {
       $("#capnhattk").submit();
   }
}