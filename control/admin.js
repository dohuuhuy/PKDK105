var fs = require('fs');
var dateFormat = require('dateformat');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var con = mysql.createConnection({
    host: "localhost",
    user: "phongkham",
    password: "@10NgonChan",
    port: "3306",
    database: 'phongkhamdb',
    acquireTimeout: 30000
});

function luutuyendung(arr_vt, arr_yc, arr_hs, a, b, c) {

    var dem = "select * from nhomvitri";
    con.query(dem, function (err, rows) {
        var rows = rows.length;
        rows = rows + 1;
        var insert_nhomvitri = "insert into nhomvitri values('" + rows + "')"
        con.query(insert_nhomvitri, function (err, result) {
            if (!err) {
                for (var i = 0; i <= a; i++) {
                    var sql = " INSERT INTO `vitrituyendung` ( `tenvitri`, `soluong`, `nhomvitri_id`) VALUES ( '" + arr_vt[i]['vitri'] + "', '" + arr_vt[i]['soluong'] + "', '" + rows + "');";
                    con.query(sql, function (err) {
                        if (!err) {
                        }
                        else {
                            console.log(err)
                        }
                    })
                }
                for (var y = 0; y <= b; y++) {
                    var sql = "INSERT INTO `yeucautuyendung` ( `tenyeucau`, `nhomvitri_id`) VALUES ( '" + arr_yc[y]['yeucau'] + "', '" + rows + "');"
                    con.query(sql, function (err) {
                        if (!err) {

                        }
                        else {
                            console.log(err)
                        }
                    })
                }
                for (var o = 0; o <= c; o++) {
                    var sql = "INSERT INTO `hosotuyendung` ( `tenhoso`, `nhomvitri_id`) VALUES ( '" + arr_hs[o]['hoso'] + "', '" + rows + "');"
                    con.query(sql, function (err) {
                        if (!err) {
                        }
                        else {
                            console.log(err)
                        }
                    })
                }
            }
            else {
            }
        })
    })
}

async function query(vt, sl, rows) {
    return new Promise(function (resolve, reject) {
        var sql = " INSERT INTO `vitrituyendung` ( `tenvitri`, `soluong`, `nhomvitri_id`) VALUES ( '" + vt + "', '" + sl + "', '" + rows + "');";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}
async function luutintuc(tieude, noidung, avatar, tacgia, loaitintuc_id) {
    return new Promise(function (resolve, reject) {
        var date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        var dem = "select * from tintuc";
        con.query(dem, function (err, result) {
            if (!err) {
                var dem = result.length;
                var sql = "insert into tintuc (tieude,noidung,nguoidang,hinhanh,ngaydang,loaibaiviet_id,trangthai_id,loaitintuc_id) values ('" + tieude + "','" + noidung + "','" + tacgia + "','" + avatar + "','" + date + "','" + 1 + "',1,'" + loaitintuc_id + "')";
                con.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        var deml = "select * from tintuc";
                        con.query(deml, function (err, result) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                var dema = result.length;
                                if (dema > dem) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false)
                                }
                            }

                        });
                    }
                });
            }

        });
    })
}

async function getdichvu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from quytrinh where loaibaiviet_id=3";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            }
            else {
                console.log(err);
            }
        })
    })
}
async function getmenu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            }
        })
    })
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
                                        getdichvu().then(function (noidung) {
                                            getgioithieu().then(function (gt) {
                                                res.render(location, { loaibaiviet: result, chuyenkhoa: result1, menu: data, loaitintuc: result2, chuyenkhoa: result3, quytrinh: noidung, gioithieu: gt });

                                            })

                                        })
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
async function capnhatdv(data) {
    return new Promise(function (resolve, reject) {
        var sql = "update quytrinh set noidung = '" + data + "' where loaibaiviet_id=3"
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}

async function getchuyenkhoa(makhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieuchuyenkhoa where chuyenkhoa_id='" + makhoa + "'";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                console.log(err);
            }
        })
    })
}
async function capnhatchuyenkhoa(noidung, makhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "update gioithieuchuyenkhoa set noidung='" + noidung + "'where chuyenkhoa_id='" + makhoa + "'";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
    })

}
async function getgioithieu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from gioithieu where loaibaiviet_id=5";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            }
            else {
                console.log(err);
            }
        })
    })
}
async function capnhatgt(data, video, avt) {
    return new Promise(function (resolve, reject) {
        var sql = "update gioithieu set noidung = '" + data + "', hinhanh='" + avt + "', video = '" + video + "' where loaibaiviet_id=5"
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}
async function luubacsi(tenbs, noidung, avt, chuyenkhoa, chucvu) {
    return new Promise(function (resolve, reject) {
        var sql = "insert into bacsi (tenbacsi,mota,chucvu,hinhanh,chuyenkhoa_id,loaibaiviet_id,trangthai_id) value ('" + tenbs + "','" + noidung + "','" + chucvu + "','" + avt + "','" + chuyenkhoa + "',6,1)";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                console.log(err)
                resolve(false);
            }
        })
    })
}
async function gettrangthietbi() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from hinhthietbi join trangthietbi on hinhthietbi.trangthietbi_id=trangthietbi.trangthietbi_id"
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                console.log(err)
                resolve(false);
            }
        })
    })
}
async function luutrangthietbi(file, noidung) {
    return new Promise(function (resolve, reject) {
        if (file.length >= 4) {
            var sql = "update trangthietbi set noidung = '" + noidung + "' where trangthietbi_id=1";
            con.query(sql, function (err) {
                if (!err) {
                    var sql1 = "DELETE FROM hinhthietbi WHERE trangthietbi_id=1";
                    con.query(sql1, function (err) {
                        if (!err) {
                            for (var i = 0; i < file.length; i++) {
                                var sql2 = "insert into hinhthietbi(hinhthietbi_id, tenhinh, trangthietbi_id) value('" + i + 1 + "','" + file[i].filename + "','" + 1 + "') ";
                                con.query(sql2, function (err) {
                                    if (!err) {
                                        resolve(true)
                                    }
                                    else {
                                        resolve(false)
                                        console.log(err)
                                    }
                                })

                            }
                        }
                        else {
                            console.log(err);
                            resolve(false);
                        }
                    })


                }
                else {
                    console.log(err)
                }
            })
        }

    })
}
function luutrangthietbikfile(noidung) {
    return new Promise(function (resolve, reject) {
        var sql = "update trangthietbi set noidung='" + noidung + "' where trangthietbi_id=1";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                resolve(false)
            }
        })
    })
}
function getloaitintuc() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from loaitintuc";
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
function getquanlytintuc(i) {
    return new Promise(function (resolve, reject) {
        if (i == 1) {
            var start = 0;
        }
        else {
            var start = (Number(i) - 1) * 12;
        }
        var finish = 12;
        var sql = "select * from tintuc join loaitintuc on tintuc.loaitintuc_id=loaitintuc.loaitintuc_id where trangthai_id=1 ORDER BY ngaydang DESC limit " + start + "," + finish + "";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result]);
            } else {
                console.log(err)
                resolve([false, 1]);
            }
        })
    })
}
function phantrangquanlytintuc() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from tintuc join loaitintuc on tintuc.loaitintuc_id=loaitintuc.loaitintuc_id where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                var page = result.length / 12;
                var pd = result.length % 12;
                if (pd > 0) {
                    page = Math.floor(page) + 1
                    resolve([true, page])
                }
                else {
                    page = Math.abs(page);
                    resolve([true, page])

                }
            }
            else {
                console.log(err);
                resolve([false, 1]);
            }
        })
    })
}
function xoatintuc(tintuc_id) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < tintuc_id.length; i++) {
            var sql = "update  tintuc set trangthai_id=2 where tintuc_id=" + tintuc_id[i] + "";

            con.query(sql, function (err) {
                if (!err) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })

        }
    })
}
function getdieuchinhtintuc(tintuc_id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from tintuc join loaitintuc on tintuc.loaitintuc_id=loaitintuc.loaitintuc_id where tintuc_id=" + tintuc_id + "";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            } else {
                resolve([false, ""])
            }
        })
    })
}
function dieuchinhtintuc_kfile(tintuc_id, tieude, noidung, tacgia, loaitintuc) {
    return new Promise(function (resolve, reject) {
        var sql = "update tintuc set tieude='" + tieude + "',noidung='" + noidung + "',nguoidang='" + tacgia + "', loaitintuc_id='" + loaitintuc + "' where tintuc_id=" + tintuc_id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}
function dieuchinhtintuc_cofile(tintuc_id, tieude, noidung, hinhanh, tacgia, loaitintuc) {
    return new Promise(function (resolve, reject) {
        var sql = "update tintuc set tieude='" + tieude + "',noidung='" + noidung + "',hinhanh='" + hinhanh + "',nguoidang='" + tacgia + "', loaitintuc_id='" + loaitintuc + "' where tintuc_id=" + tintuc_id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}
function getquanlybacsi() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from bacsi join chuyenkhoa on bacsi.chuyenkhoa_id=chuyenkhoa.chuyenkhoa_id WHERE bacsi.trangthai_id=1 and chuyenkhoa.trangthai_id=1";
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
                resolve([true, result]);
            }
            else {
                console.log(err);
                resolve([false, ""])
            }
        })
    })
}
function xoabacsi(bacsi_id) {
    return new Promise(function (resolve, reject) {
        if (bacsi_id.length > 0) {
            for (var i = 0; i < bacsi_id.length; i++) {
                var sql = "update bacsi set trangthai_id=2 where bacsi_id=" + bacsi_id[i] + "";
                con.query(sql, function (err) {
                    if (!err) {
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                })
            }

        }
    })
}
function getdieuchinhbacsi(bacsi_id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from bacsi join chuyenkhoa on bacsi.chuyenkhoa_id=chuyenkhoa.chuyenkhoa_id WHERE bacsi_id=" + bacsi_id + "";
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
function getchuyenkhoa_boid(chuyenkhoa_id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa where chuyenkhoa_id <> " + chuyenkhoa_id + "";
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
function dieuchinhbacsi_cofile(bacsi_id, tenbs, mota, avt, chuyenkhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "update bacsi set tenbacsi='" + tenbs + "', mota='" + mota + "', hinhanh='" + avt + "', chuyenkhoa_id='" + chuyenkhoa + "' where bacsi_id='" + bacsi_id + "'";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                console.log(err)
                resolve(false);
            }
        })
    })
}
function dieuchinhbacsi_kfile(bacsi_id, tenbs, mota, chuyenkhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "update bacsi set tenbacsi='" + tenbs + "', mota='" + mota + "', chuyenkhoa_id='" + chuyenkhoa + "' where bacsi_id='" + bacsi_id + "'";
        console.log(sql)
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                console.log(err)
                resolve(false);
            }
        })
    })
}
function getquanlykhoa() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa where trangthai_id=1";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result]);
            }
            else {
                console.log(err)
                resolve([false, ""]);
            }
        })
    })
}
function themkhoa(chuyenkhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from chuyenkhoa";
        con.query(sql, function (err, result) {
            var dem = result.length;
            var sql1 = "insert into chuyenkhoa value(" + dem + 1 + ",'" + chuyenkhoa + "',1)";
            con.query(sql1, function (err) {
                if (!err) {
                    resolve(true)
                }
                else {
                    resolve(false);
                }
            })
        })

    })
}
function dieuchinhkhoa(chuyenkhoa_id, tenchuyenkhoa) {
    return new Promise(function (resolve, reject) {
        var sql = "update chuyenkhoa set tenchuyenkhoa='" + tenchuyenkhoa + "' where chuyenkhoa_id=" + chuyenkhoa_id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                resolve(false)
            }
        })
    })
}
function xoachuyenkhoa(chuyenkhoa_id) {
    return new Promise(function (resolve, reject) {
        var sqk = "update chuyenkhoa set trangthai_id=2 where chuyenkhoa_id=" + chuyenkhoa_id + "";
        con.query(sqk, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}
function getquanlydichvu() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from dichvu where trangthai_id=1";
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
function luudichvu(tendichvu, mota) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from dichvu ";
        con.query(sql, function (err, result) {
            if (!err) {
                var dem = result.length;
                var sql1 = "insert into dichvu value (" + dem + 1 + ",'" + tendichvu + "','" + mota + "',1)";
                con.query(sql1, function (err) {
                    if (!err) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                })
            }
            else {
                console.log(err)
                resolve(false);
            }
        })
    })
}
function dieuchinhdichvu(dichvu_id, tendv, mota) {
    return new Promise(function (resolve, reject) {
        var sql = "update dichvu set tendichvu='" + tendv + "', motadichvu='" + mota + "' where dichvu_id=" + dichvu_id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                console.log(err);
                resolve(false);
            }
        })
    })
}
function xoadichvu(id) {
    return new Promise(function (resolve, reject) {
        var sql = "update dichvu set trangthai_id=2 where dichvu_id=" + id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
    })
}
function dangnhap(tendn, pass) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from taikhoan";
        con.query(sql, function (err, result) {
            if (!err) {
                for (var i = 0; i < result.length; i++) {

                    if (tendn === result[i]['user'] && pass === result[i]['pass']) {
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }
            }
            else {
                resolve(false)
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
                console.log(err)
                resolve([false, ""])
            }
        })
    })
}
function thembanner(tenhinh) {
    return new Promise(function (resolve, reject) {
        var sql = "insert into banner (tenhinh) value('" + tenhinh + "')";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}
function xoabanner(banner_id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from banner where banner_id=" + banner_id + "";
        con.query(sql, function (err, result) {
            if (!err) {
                var tenhinh = result[0]['tenhinh'];
                if (tenhinh) {
                    var path = "public/hinhanh/baiviet/" + tenhinh + "";
                    fs.unlink(path, function (err) {
                        if (!err) {
                            var sql1 = "delete from banner where banner_id=" + banner_id + "";
                            console.log(sql1)
                            con.query(sql1, function (err) {
                                if (!err) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false)
                                }
                            })
                        }
                        else {
                            resolve(false)
                        }
                    });

                }
                else {
                    resolve(false);
                }
            }
            else {
                resolve(false);
            }
        })
    })
}
function getnhomvitri() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from nhomvitri";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""]);
                console.log(err)
            }
        })
    })
}
function getvitrituyendung() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from vitrituyendung";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""]);
                console.log(err)
            }
        })
    })
}
function getyeucautuyendung() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from yeucautuyendung";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""]);
                console.log(err)
            }
        })
    })
}
function gethosotuyendung() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from hosotuyendung";
        con.query(sql, function (err, result) {
            if (!err) {
                resolve([true, result])
            }
            else {
                resolve([false, ""]);
                console.log(err)
            }
        })
    })
}
function luuchuyenkhoa(chuyenkhoa_id, noidung) {
    return new Promise(function (resolve, reject) {
        var sql1 = "select * from gioithieuchuyenkhoa where chuyenkhoa_id='" + chuyenkhoa_id + "'";
        con.query(sql1, function (err, result) {
            if (result != "") {
                var sql = "update gioithieuchuyenkhoa set noidung='" + noidung + "' where chuyenkhoa_id='" + chuyenkhoa_id + "'";
                console.log(sql);
                con.query(sql, function (err) {
                    if (!err) {
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                })
            }
            else {
                var sql = "insert gioithieuchuyenkhoa (noidung, chuyenkhoa_id) value('" + noidung + "','" + chuyenkhoa_id + "')"
                con.query(sql, function (err) {
                    if (!err) {
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                })
            }
        })

    })
}
function getdieuchinhtuyendung(nhomvitri_id) {
    return new Promise(function (resolve, reject) {
        if (nhomvitri_id) {
            var sql = "select * from vitrituyendung where nhomvitri_id='" + nhomvitri_id + "'";
            con.query(sql, function (err, result) {
                if (!err) {
                    var sql1 = "select * from yeucautuyendung where nhomvitri_id='" + nhomvitri_id + "'";
                    con.query(sql1, function (err, result1) {
                        if (!err) {
                            var sql2 = "select * from hosotuyendung where nhomvitri_id='" + nhomvitri_id + "'";
                            con.query(sql2, function (err, result2) {
                                if (!err) {
                                    resolve([true, result, result1, result2])
                                }
                                else {
                                    resolve([false, ""])
                                }
                            })

                        }
                        else {
                            resolve([false, ""])
                        }
                    })

                }
                else {
                    console.log(err);
                    resolve([false, ""])
                }
            })
        }
    })
}
function updatevitri(arr_vt, id, soluong) {
    console.log(arr_vt[0]['tenvitri'])
    return new Promise(function (resolve, reject) {
        var kt = [];
        for (var j = 0; j < arr_vt.length; j++) {
            var sql1 = "insert vitrituyendung(tenvitri,soluong,nhomvitri_id) value('" + arr_vt[j] + "','" + soluong[j] + "','" + id + "')";
            con.query(sql1, function (err) {
                if (!err) {
                    kt.push(1)
                }
                else {
                    kt = [];
                    return kt;
                }
            })
        }
        if (kt === []) {
            resolve(false)
        }
        else {
            resolve(true)
        }
    })
}
function updateyeucau(arr_yc, id) {
    return new Promise(function (resolve, reject) {
        var kt = [];
        for (var j = 0; j < arr_yc.length; j++) {
            var sql1 = "insert yeucautuyendung(tenyeucau,nhomvitri_id) value('" + arr_yc[j] + "','" + id + "')";
            con.query(sql1, function (err) {
                if (!err) {
                    kt.push(1)
                }
                else {
                    kt = [];
                    return kt;
                }
            })
        }
        if (kt === []) {
            resolve(false)
        }
        else {
            resolve(true)
        }


    })
}
function updatehoso(arr_hs, id) {
    return new Promise(function (resolve, reject) {
        var kt = [];
        for (var j = 0; j < arr_hs.length; j++) {
            var sql1 = "insert hosotuyendung(tenhoso,nhomvitri_id) value('" + arr_hs[j] + "','" + id + "')";
            con.query(sql1, function (err) {
                if (!err) {
                    kt.push(1)
                }
                else {
                    kt = [];
                    return kt;
                }
            })
        }
        if (kt === []) {
            resolve(false)
        }
        else {
            resolve(true)
        }


    })
}
function dieuchinhtuyendung(arr_vt, arr_yc, arr_hs, id, soluong) {

    return new Promise(function (resolve, reject) {
        if (id !== "") {
            var kt = "select * from nhomvitri where nhomvitri_id='" + id + "'";
            con.query(kt, function (err, result) {
                if (result !== "") {
                    if (arr_vt !== "" && arr_yc !== "" && arr_hs !== "") {
                        var sql = "delete from vitrituyendung where nhomvitri_id='" + id + "'";
                        var sql_yc = "delete from yeucautuyendung where nhomvitri_id='" + id + "'";
                        var sql_hs = "delete from hosotuyendung where nhomvitri_id='" + id + "'";
                        con.query(sql, function (err) {
                            if (!err) {
                                con.query(sql_yc, function (err) {
                                    if (!err) {
                                        con.query(sql_hs, function (err) {
                                            if (!err) {
                                                updatevitri(arr_vt, id, soluong).then(function (data) {
                                                    if (data === true) {
                                                        updateyeucau(arr_yc, id).then(function (data1) {
                                                            if (data1 === true) {
                                                                updatehoso(arr_hs, id).then(function (data2) {
                                                                    if (data2 === true) {
                                                                        resolve(true)
                                                                    }
                                                                    else {
                                                                        resolve(false)
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                resolve(false)
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        resolve(false)
                                                    }
                                                })
                                            }
                                            else {
                                                resolve(false)
                                            }
                                        })
                                    }
                                    else {
                                        resolve(false)
                                    }
                                })

                            }
                            else {
                                resolve(false)
                            }
                        })
                    }
                    else {
                        resolve(false)
                    }
                }
                else {
                    resolve(false)
                }
            })
        }
        else {
            resolve(false)
        }
    })

}
function xoatuyendung(id) {
    return new Promise(function (resolve, reject) {
        if (id != "") {
            var sql = "delete from vitrituyendung where nhomvitri_id='" + id + "'";
            var sql_yc = "delete from yeucautuyendung where nhomvitri_id='" + id + "'";
            var sql_hs = "delete from hosotuyendung where nhomvitri_id='" + id + "'";
            var sql_nhom = "delete from nhomvitri where nhomvitri_id='" + id + "'";
            con.query(sql, function (err) {
                if (!err) {
                    con.query(sql_yc, function (err1) {
                        if (!err1) {
                            con.query(sql_hs, function (err2) {
                                if (!err2) {
                                    con.query(sql_nhom, function (err3) {
                                        if (!err3) {
                                            resolve(true)
                                        }
                                        else {
                                            resolve(false)
                                        }
                                    })
                                }
                                else {
                                    resolve(false)
                                }
                            }
                            )
                        }
                        else {
                            resolve(false)
                        }
                    })
                }
                else {
                    resolve(false)
                }
            })
        }
    })
}
function getbooklich() {
    return new Promise(function (resolve, reject) {
        var sql = "select * from booklich where trangthai_id=1 order by ngaydat DESC";
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

function xoabooklich(arr_booklich) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < arr_booklich.length; i++) {
            var sql = "update booklich set trangthai_id=2 where booklich_id=" + arr_booklich[i] + ""
            con.query(sql, function (err) {
                if (!err) {
                    resolve(true)
                }
                else {
                    resolve(false);
                }
            })
        }
    })
}

function updatelichkham(id) {
    return new Promise(function (resolve, reject) {
        var sql = "update booklich set duyet=1 where booklich_id=" + id + "";
        con.query(sql, function (err) {
            if (!err) {
                resolve(true)
            }
            else {
                resolve(false);
            }
        })
    })
}

function sendEmail_lk(id) {
    return new Promise(function (resolve, reject) {
        var sql = "select * from booklich where booklich_id=" + id + "";
        con.query(sql, function (err, result) {
            if (!err) {
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
                                <h3 style="color: #0085ff">Thông báo lịch đặt thành công</h3>
                                <h4>Họ tên khách hàng: <strong style="font-weight:normal;">`+ result[0]['hoten'] + `</strong></h4>
                                <h4>Email: <strong style="font-weight:normal;">`+ result[0]['email'] + `</strong></h4>
                                <h4>Bạn vui lòng đến đúng lịch hẹn vào lúc `+ result[0]['thoigiandat'] + `</h4>
                                <h4>Xin cảm ơn!</h4>
                            </div>
                        `;
                var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                    from: 'NQH-Test nodemailer',
                    to: result[0]['email'],
                    subject: 'Xác nhận đặt lịch khám thành công',
                    html: content
                }
                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        resolve(true);
                    } else {
                        console.log('Message sent: ' + info.response);
                        resolve(false);
                    }
                });
            }
            else {
                resolve(false);
            }
        })
    })
}
function capnhattaikhoan(user, pass)
{
    return new Promise(function (resolve, reject) {
        var sql="update taikhoan set user='"+user+"', pass='"+pass+"' where taikhoan_id=1";
        con.query(sql,function(err)
        {
            if(!err)
            {
                resolve(true);
            }
            else
            {
                resolve(false);
            }
        })
    })
}

module.exports = {

    luutuyendung: luutuyendung,
    luutintuc: luutintuc,
    getdichvu: getdichvu,
    capnhatdv: capnhatdv,
    getchuyenkhoa: getchuyenkhoa,
    capnhatchuyenkhoa: capnhatchuyenkhoa,
    getgioithieu: getgioithieu,
    capnhatgt: capnhatgt,
    luubacsi: luubacsi,
    getloaibaiviet: getloaibaiviet,
    gettrangthietbi: gettrangthietbi,
    luutrangthietbi: luutrangthietbi,
    getquanlytintuc: getquanlytintuc,
    phantrangquanlytintuc: phantrangquanlytintuc,
    getloaitintuc: getloaitintuc,
    xoatintuc: xoatintuc,
    getdieuchinhtintuc: getdieuchinhtintuc,
    dieuchinhtintuc_cofile: dieuchinhtintuc_cofile,
    dieuchinhtintuc_kfile: dieuchinhtintuc_kfile,
    getquanlybacsi: getquanlybacsi,
    getselectchuyenkhoa: getselectchuyenkhoa,
    xoabacsi: xoabacsi,
    getdieuchinhbacsi: getdieuchinhbacsi,
    getchuyenkhoa_boid: getchuyenkhoa_boid,
    dieuchinhbacsi_cofile: dieuchinhbacsi_cofile,
    dieuchinhbacsi_kfile: dieuchinhbacsi_kfile,
    getquanlykhoa: getquanlykhoa,
    themkhoa: themkhoa,
    dieuchinhkhoa: dieuchinhkhoa,
    xoachuyenkhoa: xoachuyenkhoa,
    getquanlydichvu: getquanlydichvu,
    luudichvu: luudichvu,
    dieuchinhdichvu: dieuchinhdichvu,
    xoadichvu: xoadichvu,
    dangnhap: dangnhap,
    getbanner: getbanner,
    thembanner: thembanner,
    xoabanner: xoabanner,
    luutrangthietbikfile: luutrangthietbikfile,
    getnhomvitri: getnhomvitri,
    getvitrituyendung: getvitrituyendung,
    getyeucautuyendung: getyeucautuyendung,
    gethosotuyendung: gethosotuyendung,
    luuchuyenkhoa: luuchuyenkhoa,
    getdieuchinhtuyendung: getdieuchinhtuyendung,
    dieuchinhtuyendung: dieuchinhtuyendung,
    xoatuyendung: xoatuyendung,
    getbooklich: getbooklich,
    xoabooklich: xoabooklich,
    updatelichkham: updatelichkham,
    sendEmail_lk: sendEmail_lk,
    capnhattaikhoan:capnhattaikhoan
}
