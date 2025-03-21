-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th3 21, 2025 lúc 01:31 AM
-- Phiên bản máy phục vụ: 8.2.0
-- Phiên bản PHP: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qlbds`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bat_dong_san`
--

DROP TABLE IF EXISTS `bat_dong_san`;
CREATE TABLE IF NOT EXISTS `bat_dong_san` (
  `bdsid` int NOT NULL,
  `loaiid` int DEFAULT NULL,
  `khid` int DEFAULT NULL,
  `tinhtrang` int DEFAULT NULL,
  `dientich` float DEFAULT NULL,
  `dongia` float DEFAULT NULL,
  `masoqsqd` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mota` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hinhanh` longblob,
  `chieudai` float DEFAULT NULL,
  `chieurong` float DEFAULT NULL,
  `huehong` float DEFAULT NULL,
  `tenduong` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thanhpho` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sonha` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phuong` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`bdsid`),
  KEY `loaiid` (`loaiid`),
  KEY `khid` (`khid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bat_dong_san`
--

INSERT INTO `bat_dong_san` (`bdsid`, `loaiid`, `khid`, `tinhtrang`, `dientich`, `dongia`, `masoqsqd`, `mota`, `hinhanh`, `chieudai`, `chieurong`, `huehong`, `tenduong`, `thanhpho`, `sonha`, `quan`, `phuong`) VALUES
(1, 1, 1, 1, 100, 15000000, 'MSQD1', 'Nhà ở đẹp, mới xây', NULL, 10, 10, 5, 'Đường ABC', 'TPHCM', '123', 'Quận 1', 'Phường 1'),
(2, 2, 2, 1, 200, 8000000, 'MSQD2', 'Đất nền tiềm năng', NULL, 20, 10, 3, 'Đường DEF', 'TPHCM', '456', 'Quận 2', 'Phường 2');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_bds`
--

DROP TABLE IF EXISTS `hinh_bds`;
CREATE TABLE IF NOT EXISTS `hinh_bds` (
  `hinhid` int NOT NULL,
  `hinh` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bdsid` int DEFAULT NULL,
  PRIMARY KEY (`hinhid`),
  KEY `bdsid` (`bdsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hinh_bds`
--

INSERT INTO `hinh_bds` (`hinhid`, `hinh`, `bdsid`) VALUES
(1, NULL, 1),
(2, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hop_dong_chuyen_nhuong`
--

DROP TABLE IF EXISTS `hop_dong_chuyen_nhuong`;
CREATE TABLE IF NOT EXISTS `hop_dong_chuyen_nhuong` (
  `cnid` int NOT NULL,
  `khid` int DEFAULT NULL,
  `bdsid` int DEFAULT NULL,
  `dcid` int DEFAULT NULL,
  `giatri` float DEFAULT NULL,
  `ngaylap` datetime DEFAULT NULL,
  `trangthai` bit(1) DEFAULT NULL,
  PRIMARY KEY (`cnid`),
  KEY `khid` (`khid`),
  KEY `bdsid` (`bdsid`),
  KEY `dcid` (`dcid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hop_dong_chuyen_nhuong`
--

INSERT INTO `hop_dong_chuyen_nhuong` (`cnid`, `khid`, `bdsid`, `dcid`, `giatri`, `ngaylap`, `trangthai`) VALUES
(1, 1, 1, 1, 15000000, '2022-03-01 00:00:00', b'1'),
(2, 2, 2, 2, 10000000, '2022-04-01 00:00:00', b'1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hop_dong_dat_coc`
--

DROP TABLE IF EXISTS `hop_dong_dat_coc`;
CREATE TABLE IF NOT EXISTS `hop_dong_dat_coc` (
  `dcid` int NOT NULL,
  `khid` int DEFAULT NULL,
  `bdsid` int DEFAULT NULL,
  `ngaylaphd` date DEFAULT NULL,
  `giatri` float DEFAULT NULL,
  `tinhtrang` int DEFAULT NULL,
  `trangthai` bit(1) DEFAULT NULL,
  `ngayhethan` date DEFAULT NULL,
  PRIMARY KEY (`dcid`),
  KEY `khid` (`khid`),
  KEY `bdsid` (`bdsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hop_dong_dat_coc`
--

INSERT INTO `hop_dong_dat_coc` (`dcid`, `khid`, `bdsid`, `ngaylaphd`, `giatri`, `tinhtrang`, `trangthai`, `ngayhethan`) VALUES
(1, 1, 1, '2022-01-01', 1500000, 1, b'1', '2022-12-31'),
(2, 2, 2, '2022-02-01', 800000, 1, b'1', '2022-12-31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hop_dong_ky_gui`
--

DROP TABLE IF EXISTS `hop_dong_ky_gui`;
CREATE TABLE IF NOT EXISTS `hop_dong_ky_gui` (
  `kgid` int NOT NULL,
  `khid` int DEFAULT NULL,
  `bdsid` int DEFAULT NULL,
  `giatri` float DEFAULT NULL,
  `chiphidv` float DEFAULT NULL,
  `ngaybatdau` date DEFAULT NULL,
  `ngaykethuc` date DEFAULT NULL,
  `trangthai` bit(1) DEFAULT NULL,
  PRIMARY KEY (`kgid`),
  KEY `khid` (`khid`),
  KEY `bdsid` (`bdsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hop_dong_ky_gui`
--

INSERT INTO `hop_dong_ky_gui` (`kgid`, `khid`, `bdsid`, `giatri`, `chiphidv`, `ngaybatdau`, `ngaykethuc`, `trangthai`) VALUES
(1, 1, 1, 15000000, 1500, '2022-01-01', '2023-01-01', b'1'),
(2, 2, 2, 8000000, 800, '2022-02-01', '2023-02-01', b'1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
CREATE TABLE IF NOT EXISTS `khach_hang` (
  `khid` int NOT NULL,
  `nvid` int DEFAULT NULL,
  `hoten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diachi` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diachitt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cmnd` int DEFAULT NULL,
  `ngaysinh` date DEFAULT NULL,
  `sdt` bigint DEFAULT NULL,
  `gioitinh` bit(1) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loaikh` bit(1) DEFAULT NULL,
  `mota` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangthai` bit(1) DEFAULT NULL,
  PRIMARY KEY (`khid`),
  KEY `nvid` (`nvid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khach_hang`
--

INSERT INTO `khach_hang` (`khid`, `nvid`, `hoten`, `diachi`, `diachitt`, `cmnd`, `ngaysinh`, `sdt`, `gioitinh`, `email`, `loaikh`, `mota`, `trangthai`) VALUES
(1, 1, 'Nguyễn Văn A', '123 Đường ABC', 'Quận 1', 123456789, '1990-01-01', 987654321, b'0', 'vana@gmail.com', b'1', '', b'1'),
(2, 2, 'Trần Thị B', '456 Đường DEF', 'Quận 2', 987654321, '1992-02-02', 123456789, b'1', 'thib@gmail.com', b'0', '', b'1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loai_bds`
--

DROP TABLE IF EXISTS `loai_bds`;
CREATE TABLE IF NOT EXISTS `loai_bds` (
  `loaiid` int NOT NULL,
  `tenloai` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`loaiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loai_bds`
--

INSERT INTO `loai_bds` (`loaiid`, `tenloai`) VALUES
(1, 'Nhà ở'),
(2, 'Đất nền'),
(3, 'Căn hộ chung cư'),
(4, 'Biệt thự'),
(5, 'Nhà phố');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `nvid` int NOT NULL,
  `taikhoan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `matkhau` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tennv` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sdt` bigint DEFAULT NULL,
  `diachi` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngaysinh` date DEFAULT NULL,
  `gioitinh` tinyint(1) DEFAULT NULL,
  `doanhthu` float DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quyen` bit(1) DEFAULT NULL,
  `trangthai` bit(1) DEFAULT NULL,
  PRIMARY KEY (`nvid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`nvid`, `taikhoan`, `matkhau`, `tennv`, `sdt`, `diachi`, `ngaysinh`, `gioitinh`, `doanhthu`, `email`, `quyen`, `trangthai`) VALUES
(1, 'nv1', '$2b$10$BT2jviNijttLdtcT1akyB.lWslGtNgpwXzB4ojDURHdHh3B8LBKBS', 'Lê Văn C', 123456789, '789 Đường GHI', '1988-03-03', 0, 12000000, 'vc@gmail.com', b'1', b'1'),
(2, 'nv2', '$2b$10$7QHe3CUI6OJu7SrLsVawnuhExzU8eIXT/mbAhTkjdog', 'Phạm Thị D', 987654321, '321 Đường JKL', '1995-04-04', 1, 8000000, 'td@gmail.com', b'0', b'1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `yeu_cau_khach_hang`
--

DROP TABLE IF EXISTS `yeu_cau_khach_hang`;
CREATE TABLE IF NOT EXISTS `yeu_cau_khach_hang` (
  `ycid` int NOT NULL,
  `loaiid` int DEFAULT NULL,
  `khid` int DEFAULT NULL,
  `vitri` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mota` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `giaf` float DEFAULT NULL,
  `giat` float DEFAULT NULL,
  `daif` float DEFAULT NULL,
  `dait` float DEFAULT NULL,
  `rongf` float DEFAULT NULL,
  `rongt` float DEFAULT NULL,
  PRIMARY KEY (`ycid`),
  KEY `loaiid` (`loaiid`),
  KEY `khid` (`khid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `yeu_cau_khach_hang`
--

INSERT INTO `yeu_cau_khach_hang` (`ycid`, `loaiid`, `khid`, `vitri`, `mota`, `giaf`, `giat`, `daif`, `dait`, `rongf`, `rongt`) VALUES
(1, 1, 1, 'Quận 1', 'Cần nhà ở gần trung tâm', 12000000, 15000000, 80, 100, 10, 10),
(2, 2, 2, 'Quận 2', 'Tìm đất nền để đầu tư', 5000000, 8000000, 200, 300, 50, 100);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bat_dong_san`
--
ALTER TABLE `bat_dong_san`
  ADD CONSTRAINT `bat_dong_san_ibfk_1` FOREIGN KEY (`loaiid`) REFERENCES `loai_bds` (`loaiid`),
  ADD CONSTRAINT `bat_dong_san_ibfk_2` FOREIGN KEY (`khid`) REFERENCES `khach_hang` (`khid`);

--
-- Các ràng buộc cho bảng `hinh_bds`
--
ALTER TABLE `hinh_bds`
  ADD CONSTRAINT `hinh_bds_ibfk_1` FOREIGN KEY (`bdsid`) REFERENCES `bat_dong_san` (`bdsid`);

--
-- Các ràng buộc cho bảng `hop_dong_chuyen_nhuong`
--
ALTER TABLE `hop_dong_chuyen_nhuong`
  ADD CONSTRAINT `hop_dong_chuyen_nhuong_ibfk_1` FOREIGN KEY (`khid`) REFERENCES `khach_hang` (`khid`),
  ADD CONSTRAINT `hop_dong_chuyen_nhuong_ibfk_2` FOREIGN KEY (`bdsid`) REFERENCES `bat_dong_san` (`bdsid`),
  ADD CONSTRAINT `hop_dong_chuyen_nhuong_ibfk_3` FOREIGN KEY (`dcid`) REFERENCES `hop_dong_dat_coc` (`dcid`);

--
-- Các ràng buộc cho bảng `hop_dong_dat_coc`
--
ALTER TABLE `hop_dong_dat_coc`
  ADD CONSTRAINT `hop_dong_dat_coc_ibfk_1` FOREIGN KEY (`khid`) REFERENCES `khach_hang` (`khid`),
  ADD CONSTRAINT `hop_dong_dat_coc_ibfk_2` FOREIGN KEY (`bdsid`) REFERENCES `bat_dong_san` (`bdsid`);

--
-- Các ràng buộc cho bảng `hop_dong_ky_gui`
--
ALTER TABLE `hop_dong_ky_gui`
  ADD CONSTRAINT `hop_dong_ky_gui_ibfk_1` FOREIGN KEY (`khid`) REFERENCES `khach_hang` (`khid`),
  ADD CONSTRAINT `hop_dong_ky_gui_ibfk_2` FOREIGN KEY (`bdsid`) REFERENCES `bat_dong_san` (`bdsid`);

--
-- Các ràng buộc cho bảng `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD CONSTRAINT `khach_hang_ibfk_1` FOREIGN KEY (`nvid`) REFERENCES `nhan_vien` (`nvid`);

--
-- Các ràng buộc cho bảng `yeu_cau_khach_hang`
--
ALTER TABLE `yeu_cau_khach_hang`
  ADD CONSTRAINT `yeu_cau_khach_hang_ibfk_1` FOREIGN KEY (`loaiid`) REFERENCES `loai_bds` (`loaiid`),
  ADD CONSTRAINT `yeu_cau_khach_hang_ibfk_2` FOREIGN KEY (`khid`) REFERENCES `khach_hang` (`khid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
