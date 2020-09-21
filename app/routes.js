var func = require('../control/user');
var admin = require('../control/admin');
var formidable = require('formidable');
var multer = require('multer');
var express = require('express');
const session = require('express-session');
var fs = require('fs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.set("view engine", "ejs");
app.set("views", "./view");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mysql = require('mysql');
var md5 = require('md5');
var nodemailer = require('nodemailer');

server.listen(8080, function (data, err) {
    console.log("Server running port 8080");
});

app.use(session({
    secret: 'FMS',
    maxAge: 8 * 60 * 60 * 1000, //8 hours
    httpOnly: true,
    secure: false,
    secureProxy: true,
}));

var sess;

/* var con = mysql.createConnection({
    host: "mysql-giang.crtam43jpwgf.us-east-1.rds.amazonaws.com",
    user: "root",
    password: "12345678",
    port: "3306",
    database: 'phongkham',
    acquireTimeout: 30000
});
*/

var con = mysql.createConnection({
    host: "localhost",
    user: "phongkham",
    password: "@10NgonChan",
    port: "3306",
    database: 'phongkhamdb',
    acquireTimeout: 30000
});


con.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

con.end();

app.use(express.static('./public'));
app.use(express.static('./control'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://103.81.86.79:8080' }));

io.sockets.on('connection', function (socket) {
    console.log("co ket noi: " + socket.id);
    socket.on("themhinhtt", function (data, tenhinh) {
        var savedFilename = tenhinh;
        fs.writeFile("./public/hinhanh/baiviet/" + savedFilename, getBase64Image(data.base64), 'base64', function (err) {
            if (err !== null)
                console.log(err);
            else
                console.log("chen anh vao bai viet thanh cong!");
        })

        function getBase64Image(imgData) {
            return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        }
    })
    socket.on("thembaitt", function (tieude, noidung, hinh, tacgia, loaitintuc) {
        admin.luutintuc(tieude, noidung, hinh, tacgia, loaitintuc).then(function (data) {
            if (data === true) {
                socket.emit("thongbao", "Bạn đã thêm bài viết thành công")
            }
        })

    });
    socket.on("luutuyendung", function (arr_vt, arr_ys, arr_hs, a, b, c) {

        admin.luutuyendung(arr_vt, arr_ys, arr_hs, a, b, c);

    })
    socket.on("getchuyenkhoa", function (makhoa) {
        admin.getchuyenkhoa(makhoa).then(function (data) {
            if (data !== "") {
                socket.emit("noidungck", data);
            } else {
                console.log("k get duoc noi dung chuyen khoa")
            }
        })
    })
    socket.on("laylength", function () {
        func.getlength().then(function (data) {
            if (data[0] === true) {
                socket.emit("hanhan", data[1])
            }
            else {
                res.end();
            }
        })
    })
    socket.on("guilichkham", function () {
        admin.getbooklich().then(function (data) {
            if (data[0] === true) {
                socket.emit("getlichkham", data[1])
            }
            else {
                socket.emit("getlichkham", "")
            }
        })
    })
    socket.on("luulichkham", function (hoten, diachi, email, sdt, ngaykham, mota) {
        func.datlichkham(hoten, diachi, email, sdt, ngaykham, mota).then(function (data) {
            if (data === true) {
                socket.emit("thongbaodatlichtc")
            }
            else {
                socket.emit("thongbaodatlichtb")
            }
        })
    })
    socket.on("kiemtralichtrung", function (ngay) {
        func.kiemtralichtrung(ngay).then(function (data) {
            if (data === true) {
                console.log("true")
                socket.emit("thongbaolichkhongtrung")
            }
            else {
                console.log("false")
                socket.emit("thongbaolichtrung")
            }
        })
    })
    socket.on("refresh_booking", function () {
        console.log("ADMINSAY")
        io.sockets.emit("refresh_booking_admin")

    })
})

app.get('/bacsi', function (req, res) {
    func.getmenu().then(function (menu) {
        if (menu !== false) {
            func.getbacsi().then(function (data) {
                if (data[0] === true) {
                    func.getselectchuyenkhoa().then(function (ck) {
                        if (ck[0] === true) {
                            res.render('bacsi', { bacsi: data[1], menu: menu, chuyenkhoa: ck[1] });
                        }
                        else {
                            res.render('bacsi', { bacsi: data[1], menu: menu, chuyenkhoa: "" });
                        }
                    })
                }
                else {
                    res.render('bacsi', { bacsi: "", menu: menu, chuyenkhoa: "" });
                }
            })
        }
        else {
            res.render('bacsi', { bacsi: "", menu: "", chuyenkhoa: "" });
        }
    })

})

app.get('/tintuc/:id', function (req, res) {
    var i = req.params.id;
    func.getdata('tintuc', res, i);
});
app.get('/vietbai', function (req, res) {
    func.getloaibaiviet('ckeditor', res);
});
app.post('/capnhatdv', function (req, res) {

    var data = req.body.noidungdv;

    admin.capnhatdv(data).then(function (data) {
        if (data === true) {
            res.redirect("/dieuchinhquytrinh");
        }
        else {
            res.end();
        }
    })
})
/*
var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './public/hinhanh/avt/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    }
)

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg' || ext === '.PNG' || ext === '.mp4') {
            callback(null, true)

        }
        else {

            return callback(new Error('Phải là file ảnh'))
        }
    }
}).single("file");

var storage_baiviet = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './public/hinhanh/baiviet/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }
)
var themhinhbaiviet = multer({
    storage: storage_baiviet,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg' || ext === '.PNG' || ext === '.mp4') {
            callback(null, true)

        }
        else {

            return callback(new Error('Phải là file ảnh'))
        }
    }
}).single("themhinh");
app.post('/bottom', bp, function (req, res) {

    upload(req, res, function (err) {
        if (!err) {
            var tieude = req.body.tieude;
            var noidung = req.body.text;
            var tacgia = req.body.tacgia;
            var select = req.body.select;
            var submit = req.body.tintuc;
            if (submit) {
                if (!req.file || !tieude || !noidung || !tacgia) {
                    res.writeHead(302, { 'Location': '/vietbai' });
                    alert("Cần nhập đủ thông tin");
                    res.end();
                }
                else {
                    var file = req.file.filename;
                    func.luubaiviet('ckeditor', res, '/vietbai', tieude, noidung, file, tacgia, select);


                }
            }

        }
        else {
            console.log(err)
            res.writeHead(302, { 'Location': '/vietbai' });
            res.end();
        }

    });

});
app.post('/vietbai', bp, function (req, res, next) {
    themhinhbaiviet(req, res, function (err) {
        if (!err) {
            if (!req.file) {
                res.writeHead(302, { 'Location': '/vietbai' });
                alert("bạn chưa chọn ảnh");

            }
        }
        else {
            console.log(err)
        }

    });

});*/
app.get('/tuyendung', function (req, res) {
    func.gettuyendung('tuyendung', res)
});
app.get('/noidung/:id', function (req, res) {
    var i = req.params.id;
    func.getnoidungtintuc('noidungtintuc', res, i)
});
app.get("/", function (req, res) {
    func.getindex().then(function (data) {
        if (data[0] === true) {
            func.getmenu().then(function (mn) {
                if (mn !== false) {
                    func.getdichvu().then(function (data1) {
                        if (data1[0] === true) {
                            func.gethinhthietbi().then(function (data2) {
                                if (data2[0] === true) {
                                    func.getbanner().then(function (banner) {
                                        if (banner[0] === true) {
                                            func.gettintuc().then(function (tintuc) {
                                                if (tintuc[0] === true) {
                                                    res.render("index", { avt: data[1], menu: mn, dichvu: data1[1], trangthietbi: data2[1], banner: banner[1], tintuc: tintuc[1] });
                                                }
                                                else {
                                                    res.render("index", { avt: data[1], menu: mn, dichvu: data1[1], trangthietbi: data2[1], banner: banner[1], tintuc: "" });
                                                }
                                            })

                                        }
                                        else {
                                            res.render("index", { avt: data[1], menu: mn, dichvu: data1[1], trangthietbi: data2[1], banner: "", tintuc: "" });
                                        }
                                    })

                                }
                                else {
                                    res.render("index", { avt: data[1], menu: mn, dichvu: data1[1], trangthietbi: "", banner: "", tintuc: "" });
                                }
                            })

                        }
                        else {
                            res.render("index", { avt: data[1], menu: mn, dichvu: "", trangthietbi: "", banner: "", tintuc: "" });
                        }
                    })
                }
            })

        } else {
            res.end();
        }
    })
})
/*
app.post('/baiviettuyendung', bp, function (req, res, next) {
    var a = req.body.a;
    var b = req.body.b;
    var c = req.body.c;
    var vitri = 'vitri' + a;
    var yeucau = 'yeucau' + b;
    var hoso = 'hoso' + c;
    var select = req.body.select;
    if (select === '2') {
        var dieukienvt;
        var dieukienyc;
        var dieukienhs;
        for (var i = 0; i <= a; i++) {
            if (req.body['vitri' + i] === "" || req.body['soluong' + i] === "") {
                dieukienvt = 0;
                break;
            }
            else {
                dieukienvt = 1;

            }
        }
        for (var i = 0; i <= b; i++) {
            if (req.body['yeucau' + i] === "") {
                dieukienyc = 0;
                break;
            }
            else {
                dieukienyc = 1;

            }
        }
        for (var i = 0; i <= c; i++) {
            if (req.body['hoso' + i] === "") {
                dieukienhs = 0;
                break;
            }
            else {
                dieukienhs = 1;

            }
        }
        if (dieukienvt === 1 && dieukienyc === 1 && dieukienhs === 1) {
            admin.luutuyendung('ckeditor', '/vietbai', res, req.body, a, b, c)
        }
        else {
            console.log('k ok')
        }

    }


});
*/
app.get('/quytrinh', function (req, res) {
    func.getquytrinh(res).then(function (data) {

        if (data === false) {
            res.end();
        }
        else {

        }
    })

})
app.get('/chuyenkhoa/:id', function (req, res) {
    var i = req.params.id;
    func.getchuyenkhoa(res, i).then(function (data) {
        if (!data) {
            res.end();
        }
    })
})
app.post('/gioithieuchuyenkhoa', function (req, res) {
    var noidung = req.body.noidungck;
    var chuyenkhoa_id = req.body.selectck;
    admin.capnhatchuyenkhoa(noidung, chuyenkhoa_id).then(function (data) {
        if (data) {
            res.redirect("/gioithieuchuyenkhoa");
        } else {
            res.end();
        }
    })
})
var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './public/hinhanh/baiviet/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    }
)

var uploadgt = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg' || ext === '.PNG' || ext === '.mp4') {
            callback(null, true)

        }
        else {

            return callback(new Error('Phải là file ảnh'))
        }
    }
}).single("avtgt");
app.post('/gioithieu', function (req, res) {
    uploadgt(req, res, function (err) {
        var data = req.body.noidunggt;
        if (!req.file) {
            var video = req.body.videogt;
            admin.capnhatgt(data, video, "").then(function (data) {
                if (data === true) {
                    res.redirect("/gioithieuphongkham");
                }
                else {
                    res.end();
                }

            })
        }
        else {
            var avt = req.file.filename;
            admin.capnhatgt(data, "", avt).then(function (data) {
                if (data === true) {
                    res.redirect("/gioithieuphongkham");
                }
                else {
                    res.end();
                }

            })
        }
    })
})
app.get('/gioithieu', function (req, res) {
    func.getgioithieu(res).then(function (data) {
        if (data === false) {
            res.end();
        }
        else {

        }
    })

})


var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg' || ext === '.PNG' || ext === '.mp4') {
            callback(null, true)

        }
        else {

            return callback(new Error('Phải là file ảnh'))
        }
    }
}).single("anhdaidienbs");
app.post('/bacsi', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
        }
        else {
            var tenbs = req.body.tenbs
            var avt = req.file.filename;
            var chuyenkhoa = req.body.selectckbs
            var chucvu = req.body.chucvu
            var noidung = req.body.noindungbs;
            admin.luubacsi(tenbs, noidung, avt, chuyenkhoa, chucvu).then(function (data) {
                if (data) {
                    res.redirect("/doingubacsi");
                }
                else {
                    res.end();
                }
            })
        }



    })
})

app.get("/themtintuc", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        func.getloaibaiviet('admin/themtintuc', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/themtuyendung", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        func.getloaibaiviet('admin/themtuyendung', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/dieuchinhquytrinh", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getloaibaiviet('admin/quytrinh', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/gioithieuchuyenkhoa", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getloaibaiviet('admin/gioithieuchuyenkhoa', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/gioithieuphongkham", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getloaibaiviet('admin/gioithieuphongkham', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/doingubacsi", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getloaibaiviet('admin/doingubacsi', res);
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.get("/lienhe", function (req, res) {
    func.getmenu().then(function (mn) {
        res.render("lienhe", { menu: mn });
    })
})

app.get("/themtrangthietbi", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.gettrangthietbi().then(function (data) {
            if (data === false) {
                res.end();
            } else {
                leng = data.length
                res.render("admin/themtrangthietbi", { kq: data, l: leng })
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})
var uploadtb = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg' || ext === '.PNG' || ext === '.mp4') {
            callback(null, true)

        }
        else {

            return callback(new Error('Phải là file ảnh'))
        }
    }
}).array("file");
app.post("/themthietbi", function (req, res) {
    uploadtb(req, res, function (err) {

        admin.luutrangthietbi(req.files, req.body.text).then(function (data) {
            if (data === false) {
                res.end();
            }
            else {
                res.redirect("/themtrangthietbi")
            }
        });

    })
})
app.post("/themthietbikfile", function (req, res) {
    if (req.body.text !== "") {
        admin.luutrangthietbikfile(req.body.text).then(function (data) {
            if (data === true) {
                res.redirect("/themtrangthietbi");
            }
            else {
                res.end();
            }
        })
    }
    else {
        res.end();
    }
})
app.get("/admin/quanlytintuc/:id", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        var i = req.params.id;
        admin.getquanlytintuc(i).then(function (data) {
            if (data[0] === true) {
                admin.phantrangquanlytintuc().then(function (data1) {
                    if (data1[0] === true) {
                        admin.getloaitintuc().then(function (data2) {
                            if (data2[0] === true) {
                                res.render("admin/quanlytintuc", { kq: data[1], page: data1[1], loaitintuc: data2[1], pageIndex: Number(i) });
                            } else {

                                res.render("admin/quanlytintuc", { kq: data[1], page: data1[1], loaitintuc: "", pageIndex: Number(i) });
                            }
                        })

                    }
                    else {
                        res.render("admin/quanlytintuc", { kq: data[1], page: data1[1], loaitintuc: "", pageIndex: Number(i) });
                    }
                })
            }
            else {
                res.render("admin/quanlytintuc", { kq: data[1], page: data[1], loaitintuc: "", pageIndex: Number(i) });
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap");
    }
})

app.post("/xoatintuc", function (req, res) {
    var a = req.body.a;
    var tintuc_id = JSON.parse("[" + a + "]");
    admin.xoatintuc(tintuc_id).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlytintuc/1")
        }
        else {
            console.log("false")
            res.end();
        }
    });
})

app.get("/admin/dieuchinhtintuc/:id", function (req, res) {
    var i = req.params.id;
    admin.getdieuchinhtintuc(i).then(function (data) {
        if (data[0] === true) {
            admin.getloaitintuc().then(function (data1) {
                if (data1[0] === true) {
                    res.render("admin/dieuchinh", { kq: data[1], loaitintuc: data1[1] });
                }
                else {
                    res.render("admin/dieuchinh", { kq: data[1], loaitintuc: "" });
                }
            })

        }
        else {
            res.render("admin/dieuchinh", { kq: "", loaitintuc: "" });
        }
    })

})

app.post("/dieuchinhtintuc/:id", function (req, res) {
    var i = req.params.id;
    //Khởi tạo form
    var form = new formidable.IncomingForm();
    //Thiết lập thư mục chứa file trên server
    form.uploadDir = "public/hinhanh/baiviet/";
    //xử lý upload
    form.parse(req, function (err, fields, file) {
        //path tmp trên server
        var tieude = fields.tieude;
        var noidung = fields.noidungtintuc;
        var tacgia = fields.tacgia;
        var loaitintuc = fields.loaitintuc;
        if (file.anhdaidienbs.name) {
            var path = file.anhdaidienbs.path;
            //thiết lập path mới cho file
            var newpath = form.uploadDir + Date.now() + '-' + file.anhdaidienbs.name;

            var hinhanh = Date.now() + '-' + file.anhdaidienbs.name;

            fs.rename(path, newpath, function (err) {
                if (!err) {
                    console.log(newpath)
                    admin.dieuchinhtintuc_cofile(i, tieude, noidung, hinhanh, tacgia, loaitintuc).then(function (data) {
                        if (data === true) {
                            res.redirect("/admin/quanlytintuc/1");
                        }
                        else {
                            res.end();
                        }
                    })
                }
                else {
                    res.end();
                }

            });
        }
        else {
            admin.dieuchinhtintuc_kfile(i, tieude, noidung, tacgia, loaitintuc).then(function (data) {
                if (data === true) {
                    res.redirect("/admin/quanlytintuc/1");
                }
                else {
                    res.end();
                }
            })
        }
    });
})

app.get("/admin/quanlybacsi", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getquanlybacsi().then(function (data) {
            if (data[0] === true) {
                admin.getselectchuyenkhoa().then(function (data1) {
                    if (data1[0] === true) {
                        res.render("admin/quanlybacsi", { kq: data[1], chuyenkhoa: data1[1] })
                    }
                    else {
                        res.render("admin/quanlybacsi", { kq: data[1], chuyenkhoa: "" })
                    }
                })
            } else {
                res.render("admin/quanlybacsi", { kq: "", chuyenkhoa: "" })
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.post("/xoabacsi", function (req, res) {
    if (req.body.a) {
        var a = req.body.a;
        var bacsi_id = JSON.parse("[" + a + "]");
        admin.xoabacsi(bacsi_id).then(function (data) {
            if (data === true) {
                res.redirect("/admin/quanlybacsi");
            }
            else {
                res.end();
            }
        })
    }
    else {
        res.end()
    }

})

app.get("/admin/dieuchinhbacsi/:id", function (req, res) {
    var i = req.params.id;
    admin.getdieuchinhbacsi(i).then(function (data) {
        if (data[0] === true) {
            admin.getchuyenkhoa_boid(data[1][0]['chuyenkhoa_id']).then(function (data2) {
                if (data2[0] === true) {
                    res.render("admin/dieuchinhbacsi", { kq: data[1], chuyenkhoa: data2[1] })
                }
                else {
                    res.render("admin/dieuchinhbacsi", { kq: data[1], chuyenkhoa: "" })
                }
            })
        }
        else {
            res.render("admin/dieuchinhbacsi", { kq: "", chuyenkhoa: "" })
        }
    })
})

app.post("/dieuchinhbacsi/:id", function (req, res) {
    var i = req.params.id;
    //Khởi tạo form
    var form = new formidable.IncomingForm();
    //Thiết lập thư mục chứa file trên server
    form.uploadDir = "public/hinhanh/baiviet/";
    //xử lý upload
    form.parse(req, function (err, fields, file) {
        //path tmp trên server
        var tenbs = fields.tenbs;
        var mota = fields.noindungbs;
        var chuyenkhoa = fields.selectckbs;
        if (file.anhdaidienbs.name) {
            var path = file.anhdaidienbs.path;
            //thiết lập path mới cho file
            var newpath = form.uploadDir + Date.now() + '-' + file.anhdaidienbs.name;

            var hinhanh = Date.now() + '-' + file.anhdaidienbs.name;

            fs.rename(path, newpath, function (err) {
                if (!err) {
                    admin.dieuchinhbacsi_cofile(i, tenbs, mota, hinhanh, chuyenkhoa).then(function (data) {
                        if (data === true) {
                            res.redirect("/admin/quanlybacsi")
                        }
                        else {
                            res.end();
                        }
                    })

                }
                else {
                    res.end();
                }

            });
        }
        else {
            admin.dieuchinhbacsi_kfile(i, tenbs, mota, chuyenkhoa).then(function (data) {

                if (data === true) {
                    res.redirect("/admin/quanlybacsi")
                }
                else {
                    res.end();
                }
            })
        }
    });
})

app.get("/admin/quanlykhoa", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getquanlykhoa().then(function (data) {
            if (data[0] === true) {
                res.render("admin/quanlykhoa", { kq: data[1] });
            }
            else {
                res.render("admin/quanlykhoa", { kq: "" });
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.post("/themkhoa", function (req, res) {
    var tenchuyenkhoa = req.body.tenchuyenkhoa;
    admin.themkhoa(tenchuyenkhoa).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlykhoa");
        }
        else {
            res.end();
        }
    })
})

app.post("/dieuchinhkhoa/:id", function (req, res) {
    var tenkhoa = req.body.suachuyenkhoa;
    var i = req.params.id;
    admin.dieuchinhkhoa(i, tenkhoa).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlykhoa");
        }
        else {
            res.end();
        }
    })
})

app.post("/xoakhoa/:id", function (req, res) {
    var i = req.params.id;
    admin.xoachuyenkhoa(i).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlykhoa");
        }
        else {
            res.end()
        }
    })
})

app.get("/admin/quanlydichvu", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getquanlydichvu().then(function (data) {
            if (data[0] === true) {
                res.render("admin/quanlydichvu", { kq: data[1] })
            }
            else {
                res.render("admin/quanlydichvu", { kq: "" })
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.post("/themdichvu", function (req, res) {
    var tendichvu = req.body.tendv;
    var mota = req.body.mota;
    admin.luudichvu(tendichvu, mota).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlydichvu");
        }
        else {
            res.end();
        }
    })
})

app.post("/dieuchinhdichvu/:id", function (req, res) {
    var i = req.params.id;
    var tendv = req.body.tendv1;
    var mota = req.body.mota1;
    console.log(tendv);
    console.log(mota)
    console.log(i)
    admin.dieuchinhdichvu(i, tendv, mota).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlydichvu");
        }
        else {
            res.end();
        }
    })

})

app.post("/xoadichvu/:id", function (req, res) {
    var i = req.params.id;
    admin.xoadichvu(i).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlydichvu");
        }
        else {
            res.end();
        }
    })
})

app.get("/trangthietbi", function (req, res) {
    func.gettrangthietbi().then(function (data) {
        if (data[0] === true) {
            func.randomtintuc().then(function (data1) {
                if (data1[0] === true) {
                    func.getmenu().then(function (data2) {
                        if (data2 !== false) {
                            func.getvideo().then(function (video) {
                                if (video[0] === true) {
                                    func.gettintuc().then(function (tintuc) {
                                        if (tintuc[0] === true) {
                                            res.render("quytrinh", { quytrinh: data[1], random: data1[1], menu: data2, video: video[1], tintuc: tintuc[1], so: 1 })
                                        }
                                        else {
                                            res.render("quytrinh", { quytrinh: data[1], random: data1[1], menu: data2, video: video[1], tintuc: "", so: 1 })
                                        }
                                    })

                                }
                                else {
                                    res.render("quytrinh", { quytrinh: data[1], random: data1[1], menu: data2, video: "", tintuc: "", so: 1 })
                                }
                            })
                        }
                        else {
                            res.render("quytrinh", { quytrinh: data[1], random: data1[1], menu: "", video: "", tintuc: "", so: 1 })
                        }

                    })
                }
                else {
                    res.render("quytrinh", { quytrinh: data[1], random: "", menu: "", video: "", tintuc: "", so: 1 })
                }
            })
        }
        else {
            res.render("quytrinh", { quytrinh: "", random: "", menu: "", video: "", tintuc: "", so: 1 })
        }
    })
})

app.get("/search", function (req, res) {
    var search = req.query.noidungtimkiem;
    console.log(search)
    func.getmenu().then(function (menu) {
        if (menu !== false) {
            if (search) {
                func.timkiemtintuc(search).then(function (data) {
                    if (data[0] === true) {
                        res.render("timkiem", { menu: menu, timkiem: data[1] })
                    }
                    else {
                        res.render("timkiem", { menu: menu, timkiem: "" })
                    }
                })
            } else {
                res.render("timkiem", { menu: menu, timkiem: "" })
            }
        }
        else {
            res.render("timkiem", { menu: "", timkiem: "" })
        }
    })
})

app.get("/admin/dangnhap", function (req, res) {
    console.log(md5("pkdk105"));
    res.render("admin/login");
})

app.post("/dangnhap", function (req, res) {
    var tendn = req.body.tendn;
    var pass = req.body.pass;
    if (tendn !== "" && pass !== "") {
        var ten = md5(tendn);
        var pas = md5(pass);
        admin.dangnhap(ten, pas).then(function (data) {
            if (data === true) {
                const sess = req.session;
                sess.permission = "admin";

                res.redirect("/admin/quanlytintuc/1");
            }
            else {
                res.redirect("/admin/dangnhap")
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})
app.get("/admin/quanlybanner", function (req, res) {
    admin.getbanner().then(function (banner) {
        if (banner[0] === true) {
            res.render("admin/quanlybanner", { banner: banner[1] })
        }
    })
})
app.post("/xoabanner/:id", function (req, res) {
    var i = req.params.id;
    admin.xoabanner(i).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlybanner");
        }
        else {
            res.end();
        }
    })
})
app.post("/thembanner", function (req, res) {
    var form = new formidable.IncomingForm();
    //Thiết lập thư mục chứa file trên server
    form.uploadDir = "public/hinhanh/baiviet/";
    //xử lý upload
    form.parse(req, function (err, fields, file) {
        //path tmp trên server
        if (file.banner.name) {
            var path = file.banner.path;
            //thiết lập path mới cho file
            var newpath = form.uploadDir + Date.now() + '-' + file.banner.name;

            var hinhanh = Date.now() + '-' + file.banner.name;

            fs.rename(path, newpath, function (err) {
                if (!err) {
                    admin.thembanner(hinhanh).then(function (data) {
                        if (data === true) {
                            res.redirect("/admin/quanlybanner")
                        }
                        else {
                            res.end()
                        }
                    })
                }
                else {
                    res.end();
                }
            })
        }
    })
})
app.post("/luuchuyenkhoa", function (req, res) {
    var chuyenkhoa_id = req.body.selectck;
    var noidung = req.body.noidungck;
    admin.luuchuyenkhoa(chuyenkhoa_id, noidung).then(function (data) {
        if (data === true) {
            res.redirect("/gioithieuchuyenkhoa");
        }
        else {
            res.end();
        }
    })
})


app.get("/admin/quanlytuyendung", function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        admin.getnhomvitri().then(function (nhomvt) {
            if (nhomvt[0] === true) {
                admin.getvitrituyendung().then(function (vttd) {
                    if (vttd[0] === true) {
                        admin.getyeucautuyendung().then(function (yctd) {
                            if (yctd[0] === true) {
                                admin.gethosotuyendung().then(function (hstd) {
                                    if (hstd[0] === true) {
                                        res.render("admin/quanlytuyendung", { nhomvt: nhomvt[1], vttd: vttd[1], yctd: yctd[1], hstd: hstd[1] })
                                    }
                                    else {
                                        res.render("admin/quanlytuyendung", { nhomvt: nhomvt[1], vttd: vttd[1], yctd: yctd[1], hstd: "" })
                                    }
                                })
                            }
                            else {
                                res.render("admin/quanlytuyendung", { nhomvt: nhomvt[1], vttd: vttd[1], yctd: "", hstd: "" })
                            }
                        })
                    }
                    else {
                        res.render("admin/quanlytuyendung", { nhomvt: nhomvt[1], vttd: "", yctd: "", hstd: "" })
                    }
                })
            }
            else {
                res.render("admin/quanlytuyendung", { nhomvt: "", vttd: "", yctd: "", hstd: "" })
            }
        })
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})
app.get("/admin/dieuchinhtuyendung/:id", function (req, res) {
    var i = req.params.id;
    if (i) {
        admin.getdieuchinhtuyendung(i).then(function (data) {
            if (data[0] === true) {
                res.render("admin/dieuchinhtuyendung", { vitri: data[1], yeucau: data[2], hoso: data[3], id: i })
            }
            else {
                res.redirect("/admin/quanlytuyendung");
            }
        })
    }
    else {
        res.redirect("/admin/quanlytuyendung");
    }
})
app.post("/formdieuchinhtuyendung/:id", function (req, res) {
    var i = req.params.id;
    var a = req.body.diema;
    var b = req.body.diemb;
    var c = req.body.diemc;
    var arr_vt = []
    var arr_yc = []
    var arr_hs = []
    var soluong = []
    if (i != "" && a >= 0 && b >= 0 && c >= 0) {
        for (var s = 0; s <= a; s++) {
            arr_vt.push(req.body['vitri' + s + ''])
            soluong.push(req.body['soluong' + s + ''])
        }
        for (var s = 0; s <= b; s++) {
            arr_yc.push(req.body['yeucau' + s + ''])
        }
        for (var s = 0; s <= c; s++) {
            arr_hs.push(req.body['hoso' + s + ''])
        }
        admin.dieuchinhtuyendung(arr_vt, arr_yc, arr_hs, i, soluong).then(function (data) {
            if (data === true) {
                res.redirect("/admin/dieuchinhtuyendung/" + i + "")
            }
            else {
                res.end();
            }
        })
    }
})
app.post("/xoatuyendung/:id", function (req, res) {
    var i = req.params.id;
    admin.xoatuyendung(i).then(function (data) {
        if (data === true) {
            res.redirect("/admin/quanlytuyendung");
        }
        else {
            res.end()
        }
    })
})
app.get("/admin", function (req, res) {
    res.redirect("/admin/dangnhap");
})
app.get("/thu", function (req, res) {
    res.render("thu");
})

app.get("/booking", (req, res) => {
    func.getmenu().then(function (mn) {
        res.render('booking', { menu: mn });
    })
})

app.get("/thongbaothanhcong", function (req, res) {
    res.render("thongbao");
})
app.get("/thongbaokhongthanhcong", function (req, res) {
    res.render("tbktc");
})
app.get("/admin/quanlylichkham", function (req, res) {
    admin.getbooklich().then(function (data) {
        if (data[0] === true) {
            res.render("admin/quanlydatlich", { kq: data[1] })
        }
        else {
            res.render("admin/quanlydatlich", { kq: "" })
        }
    })
})

app.post("/admin/quanlylichkham", function (req, res) {
    admin.updatelichkham(req.body.id).then(function (data) {
        if (data === true) {
            admin.sendEmail_lk(req.body.id).then(function (data) {
                admin.getbooklich().then(function (data) {
                    if (data[0] === true) {
                        res.render("admin/quanlydatlich", { kq: data[1] })
                    }
                    else {
                        res.render("admin/quanlydatlich", { kq: "" })
                    }
                })
            })
        }
    })
})

app.post("/xoabooklich", function (req, res) {
    if (req.body.a) {
        var a = req.body.a;
        var booklich_id = JSON.parse("[" + a + "]");
        admin.xoabooklich(booklich_id).then(function (data) {
            if (data === true) {
                res.redirect("/admin/quanlylichkham");
            }
            else {
                res.end();
            }
        })
    }
    else {
        res.end()
    }

})

app.get('/admin/taikhoan', function (req, res) {
    sess = req.session
    if (sess.permission === "admin") {
        res.render("admin/taikhoan");
    }
    else {
        res.redirect("/admin/dangnhap")
    }
})

app.post("/capnhattaikhoan", function (req, res) {
    var user = md5(req.body.user);
    var pass = md5(req.body.pass);
    console.log(user + " " + pass);
    if (user === "" || pass === "") {
        res.end();
    }
    else {
        admin.capnhattaikhoan(user, pass).then(function (data) {
            if (data === true) {
                res.redirect("/admin/taikhoan");
            }
            else {
                res.end();
            }
        })
    }
})

app.get("/logout",function(req,res)
{
    sess = req.session;
    sess.destroy();
    res.redirect("/")
})

app.post('/send-mail', function (req, res) {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter = nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'benhviendakhoa105@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'Zam123456' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #ececec">
            <h3 style="color: #0085ff">Người dùng gửi liên hệ: `+ req.body.subject + `</h3>
            <h4>Họ tên: <strong style="font-weight:normal;">`+ req.body.contact_input + `</strong></h4>
            <h4>Email: <strong style="font-weight:normal;">`+ req.body.contact_email + `</strong></h4>
            <h4>Nội dung: <strong style="font-weight:normal;">`+ req.body.message + `</strong></h4>
        </div>
    `;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'NQH-Test nodemailer',
        to: 'phongkhamdakhoa105@gmail.com',
        subject: 'Khách hàng ' + req.body.contact_email + 'gửi yêu cầu liên hệ!',
        html: content
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
            req.flash('mess', 'Lỗi gửi mail: ' + err); //Gửi thông báo đến người dùng
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
});
