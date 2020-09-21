var mysql = require('mysql');
var dateFormat = require('dateformat');
var con = mysql.createConnection({
    host: "localhost",
    user: "phongkham",
    password: "@10NgonChan",
    port: "3306",
    database: 'phongkhamdb',
    acquireTimeout: 30000
});

async function getmenu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            }
            else {
                resolve(false);
            }
        })
    })
}
function getdata(location, res, id) {
    var sql1 = "select * from tintuc  where loaibaiviet_id=1 and trangthai_id=1 and loaitintuc_id='" + id + "'  limit 4";
    var sql = "select * from tintuc where loaibaiviet_id=1 and trangthai_id=1 and loaitintuc_id='" + id + "'";
    var sql2 = "SELECT * FROM tintuc WHERE trangthai_id=1  ORDER BY RAND() LIMIT 5";
    con.query(sql, function (err, result) {
        if (!err) {
            con.query(sql1, function (err, result1) {
                if (!err) {
                    con.query(sql2, function (err, result2) {
                        if (!err) {
                            getmenu().then(function (data) {
                                res.render(location, { thu: result, slide: result1, random: result2, menu: data });
                            })

                        }
                    })
                }

            })
        }
    });
}

function getloaibaiviet(location, res) {
    var sql = "select * from loaibaiviet";
    var sql1 = "select * from chuyenkhoa where trangthai_id=1";
    var sql2 = "select * from loaitintuc";
    var sql3 = "select * from chuyenkhoa where trangthai_id=1";
    con.query(sql, function (err, result) {
        if (!err) {
            con.query(sql1, function (err1, result1) {
                if (!err1) {
                    con.query(sql2, function (err, result2) {
                        if (!err) {

                            con.query(sql3, function (err, result3) {
                                if (!err) {
                                    getmenu().then(function (data) {
                                        res.render(location, { loaibaiviet: result, chuyenkhoa: result1, menu: data, loaitintuc: result2, chuyenkhoa: result3 });
                                    })
                                }
                            })
                        }
                        else {
                            console.log(err)
                        }
                    })

                }
                else {
                    console.log(err1);
                }
            })
        }
        else {
            console.log(err);
        }


    });
}
/*
function luubaiviet(location, res, router, tieude, noidung, avatar, tacgia, chuyenmuc) {

    var date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var dem = "select * from baiviet";
    con.query(dem, function (err, result) {
        if (!err) {
            var dem = result.length;
            
            var sql = "insert into baiviet (tieude,noidung,nguoidang,hinhanh,ngaydang,loaibaiviet_id,trangthai_id) values ('" + tieude + "','" + noidung + "','" + tacgia + "','" + avatar + "','" + date + "','" + chuyenmuc + "',1)";
            con.query(sql, function (err, result) {
                if (err) {
                    console.error(`${JSON.stringify(err, null, 2)}`);
                } else {

                    var deml = "select * from baiviet";
                    con.query(deml, function (err, result) {
                        var dema = result.length;
                        if (dema > dem) {
                            alert('thành công')
                        }
                    });

                }


            });
            res.writeHead(302, { 'Location': router });
            
        }

    });

}
*/
/*
function gethinh(filename) {

    var fil = document.getElementById("themhinh").value;
    var filename = fil.replace(/^.*?([^\\\/]*)$/, '$1')
    var editor = CKEDITOR.instances.content;
    var link = '../hinhanh/baiviet/';
    var value = '<p><img alt="" class="img-fluid" src="' + link + filename + '"/></p>'
    if (editor.mode == 'wysiwyg') {
        editor.insertHtml(value);

    } else {
        alert('You must be in WYSIWYG mode!');
    }
}
*/
function getnoidungtintuc(location, res, baiviet_id) {
    var select = " select * from tintuc WHERE tintuc_id ="
    var sql = select + baiviet_id;
    var sql1 = "select * from tintuc limit 5 where trangthai_id=1";
    con.query(sql, function (err, result) {
        if (!err) {
            con.query(sql1, function (err, rs) {
                if (!err) {
                    getmenu().then(function (data) {
                        if (data !== false) {
                            gettintuc().then(function (tintuc) {
                                if (tintuc[0] === true) {
                                    getvideo().then(function (video) {
                                        if (video[0] === true) {
                                            res.render(location, { noidung: result, danhsach: rs, menu: data, tintuc: tintuc[1], video: video[1] });
                                        }
                                        else {
                                            res.render(location, { noidung: result, danhsach: rs, menu: data, tintuc: tintuc[1], video: "" });
                                        }
                                    })

                                }
                                else {
                                    res.render(location, { noidung: result, danhsach: rs, menu: data, tintuc: "", video: "" });
                                }
                            })
                        }
                        else {
                            res.render(location, { noidung: result, danhsach: rs, menu: "", tintuc: "", video: "" });
                        }


                    })


                }
                else {
                    res.render(location, { noidung: result, danhsach: "", menu: "", tintuc: "", video: "" });
                }

            });

        }
        else {
            res.render(location, { noidung: "", danhsach: "", menu: "", tintuc: "", video: "" });
            console.log(err)
        }

    });
}
function gettuyendung(location, res) {
    var nhom = "select * from nhomvitri"
    con.query(nhom, function (err, rows) {
        var dem = rows.length
        var vitri = "select * from vitrituyendung "
        var yeucau = "select * from yeucautuyendung "
        var hoso = "select * from hosotuyendung "
        con.query(vitri, function (err, result_vt) {
            if (!err) {
                console.log(dem);
                con.query(yeucau, function (err, result_yc) {
                    if (!err) {
                        con.query(hoso, function (err, result_hs) {
                            if (!err) {
                                getmenu().then(function (data) {
                                    res.render(location, { dem: dem, vitri: result_vt, yeucau: result_yc, hoso: result_hs, menu: data })
                                })
                            }
                        })
                    }
                })
            }

        })
    })
}
function randomtintuc() {
    return new Promise(function (resolve, reject) {
        var sql2 = "SELECT * FROM tintuc ORDER BY RAND() LIMIT 5 where trangthai_id=1";
        con.query(sql2, function (err, result) {
            if (!err) {
                resolve([true, result]);
            }
            else {
                console.log(err);
                resolve([false, ""])
            }
        })
    })
}
async function getquytrinh(res) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from quytrinh";
        var sql2 = "SELECT * FROM tintuc ORDER BY RAND() LIMIT 5 where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                con.query(sql2, function (err, result2) {
                    if (!err) {

                        getmenu().then(function (data) {
                            if (data !== false) {
                                getvideo().then(function (video) {
                                    if (video[0] === true) {
                                        gettintuc().then(function (tintuc) {
                                            if (tintuc[0] === true) {
                                                res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: tintuc[1], so: 1 });
                                                resolve(true);
                                            }
                                            else {
                                                res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: "", so: 1 });
                                                resolve(true);
                                            }
                                        })

                                    }
                                    else {
                                        res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: "", tintuc: "", so: 1 });
                                        resolve(true);
                                    }
                                })
                            }
                            else {
                                res.render('quytrinh', { quytrinh: result, random: result2, menu: "", video: "", tintuc: "", so: 1 });
                                resolve(true);
                            }
                        })

                    }
                    else {
                        resolve(false);
                    }
                })

            }
            else {
                resolve(false);
            }
        })
    })
}
async function getchuyenkhoa(res, chuyenkhoa_id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieuchuyenkhoa where chuyenkhoa_id='" + chuyenkhoa_id + "'";
        var sql2 = "SELECT * FROM tintuc ORDER BY RAND() LIMIT 5 where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                con.query(sql2, function (err, result2) {
                    if (!err) {
                        getmenu().then(function (data) {
                            if (data !== false) {
                                getvideo().then(function (video) {
                                    if (video[0] === true) {
                                        gettintuc().then(function (tintuc) {
                                            if (tintuc[0] === true) {
                                                res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: tintuc[1], so: 2 });
                                                resolve(true);
                                            }
                                            else {
                                                res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: "", so: 2 });
                                                resolve(true);
                                            }
                                        })

                                    }
                                    else {
                                        res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: "", tintuc: "", so: 2 });
                                        resolve(true);
                                    }
                                })
                            }
                            else {
                                res.render('quytrinh', { quytrinh: result, random: result2, menu: "", video: "", tintuc: "", so: 2 });
                                resolve(true);
                            }

                        })
                    }
                    else {
                        res.render('quytrinh', { quytrinh: result, random: "", menu: "", video: "", tintuc: "", so: 2 });
                        resolve(true);
                    }
                })

            }
            else {
                res.render('quytrinh', { quytrinh: "", random: "", menu: "", video: "", tintuc: "", so: 2 });
                resolve(true);
            }
        })
    })
}

async function getgioithieu(res) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieu";
        var sql2 = "SELECT * FROM tintuc ORDER BY RAND() LIMIT 5 where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                con.query(sql2, function (err, result2) {
                    if (!err) {

                        getmenu().then(function (data) {
                            getvideo().then(function (video) {
                                if (video[0] === true) {
                                    gettintuc().then(function (tintuc) {
                                        if (tintuc[0] === true) {
                                            res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: tintuc[1], so: 1 });
                                            resolve(true);
                                        }
                                        else {
                                            res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: video[1], tintuc: "", so: 1 });
                                            resolve(true);
                                        }
                                    })

                                }
                                else {
                                    res.render('quytrinh', { quytrinh: result, random: result2, menu: data, video: "", tintuc: "", so: 1 });
                                    resolve(true);
                                }
                            })

                        })
                    }
                    else {
                        resolve(false);
                    }
                })

            }
            else {
                resolve(false);
            }
        })
    })
}

function getvideo() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieu";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                console.log(err);
                resolve([false, ""])
            }
        })
    })
}
async function getbacsi() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from bacsi join chuyenkhoa on bacsi.chuyenkhoa_id = chuyenkhoa.chuyenkhoa_id where bacsi.trangthai_id=1 and chuyenkhoa.trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {


                resolve([true, result]);


            } else {
                resolve([false, ""])
                console.log(err);
            }
        })
    })
}
async function getlength() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from bacsi join chuyenkhoa on bacsi.chuyenkhoa_id = chuyenkhoa.chuyenkhoa_id where bacsi.trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                var kq = result.length;
                resolve([true, kq])
            } else {
                resolve([false, ""])
                console.log(err);
            }
        })
    })
}
function getdichvu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from dichvu where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                console.log(err);
                resolve([false, ""]);
            }
        })
    })
}
function gethinhthietbi() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from hinhthietbi where trangthietbi_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result]);
            }
            else {
                resolve([false, ""])
            }
        })
    })
}
async function getindex() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieu";
        con.query(sql, function (err, result) {
            if (!err) {
                var kq = result;

                resolve([true, kq])
            } else {
                resolve([false, ""])
                console.log(err);
            }
        })
    })
}
function gettrangthietbi() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from trangthietbi";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result]);
            }
            else {
                console.log(err);
                resolve([false, ""]);
            }
        })
    })
}
function timkiemtintuc(noidung) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from tintuc where trangthai_id=1 and (tieude like '%" + noidung + "%' or nguoidang like  '%" + noidung + "%' or ngaydang like  '%" + noidung + "%' )";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""])
            }
        })
    })
}
function getselectchuyenkhoa() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                console.log(err)
                resolve([false, ""])
            }
        })
    })
}
function gettintuc() {
    return new Promise(function (resolve, reject) {
        var sql = "SELECT * FROM tintuc WHERE trangthai_id=1 ORDER BY tintuc_id DESC LIMIT 4";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                console.log(err);
                resolve([false, ""]);
            }
        })

    })
}
function getbanner() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from banner";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""])
            }
        })
    })
}
function datlichkham(hoten, diachi, email, sdt, tg, mota) {
    return new Promise(function (resolve, reject) {
        var date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        if (hoten !== "", diachi !== "", email !== "", sdt !== "", tg !== "") {
            var sql1 = "select * from booklich";
            con.query(sql1, function (err, result) {
                if(!err)
                {
                    var dem=result.length;
                    var ma=dem+1;
                    var sql = "insert into booklich (booklich_id,hoten, diachi,email,sdt,thoigiandat,mota,ngaydat,trangthai_id,duyet) value(" + ma + ",'" + hoten + "','" + diachi + "','" + email + "','" + sdt + "','" + tg + "','" + mota + "','" + date + "',1,0)";
                    console.log(sql)
                    con.query(sql, function (err) {
                        if (!err) {
                            resolve(true)
                        }
                        else {
                            resolve(false)
                        }
                    })
                }
                else
                {
                    resolve(false)
                }
            })

        }
        else {
            resolve(false)
        }

    })
}
function kiemtralichtrung(ngay)
{
    return new Promise(function (resolve, reject) {
            var sql="select * from booklich where trangthai_id=1 and thoigiandat ='"+ngay+"'";
            console.log(sql)
            con.query(sql,function(err,result)
            {
                if(!err)
                {
                    if(result.length>=1)
                    {
                        resolve(false)
                    }
                    else
                    {
                        resolve(true)
                    }
                }
                else
                {
                    resolve(false)
                }
            })
    })
}

module.exports = {
    getdata: getdata,
    getloaibaiviet: getloaibaiviet,
    //luubaiviet: luubaiviet,
    //gethinh: gethinh,
    getnoidungtintuc: getnoidungtintuc,
    gettuyendung: gettuyendung,
    getquytrinh: getquytrinh,
    getchuyenkhoa: getchuyenkhoa,
    getgioithieu: getgioithieu,
    getbacsi: getbacsi,
    getlength: getlength,
    getindex: getindex,
    getmenu: getmenu,
    getdichvu: getdichvu,
    gettrangthietbi: gettrangthietbi,
    randomtintuc: randomtintuc,
    gethinhthietbi: gethinhthietbi,
    timkiemtintuc: timkiemtintuc,
    getselectchuyenkhoa: getselectchuyenkhoa,
    gettintuc: gettintuc,
    getbanner: getbanner,
    getvideo: getvideo,
    datlichkham: datlichkham,
    kiemtralichtrung:kiemtralichtrung
}

