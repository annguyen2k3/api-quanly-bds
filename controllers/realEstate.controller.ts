import { Request, Response } from "express";
import { bat_dong_san, BDSCreationAttributes } from "../models/bat_dong_san.model";
import { StatusCodes } from "http-status-codes";
import { CommonMess, CustomerMess, RealEstateMess } from "../constants/messages.constant";
import { loai_bds } from "../models/loai_bds.model";
import { khach_hang } from "../models/khach_hang.model";
import { Op } from "sequelize";
import { hinh_bds } from "../models/hinh_bds.model";
import { deleteImgCloud } from "../helper/deleteImgCloudinary";
import { realEstateStatus } from "../constants/enums";

// [GET] /real-estate/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject: Record<string, any> = {};

        // Find Status
        let status: number | undefined = undefined;
        const rawStatus = req.query.status;

        if (rawStatus !== undefined && rawStatus !== "") {
            const parsedStatus = parseInt(rawStatus as string, 10);

            if (isNaN(parsedStatus) || !Object.values(realEstateStatus).includes(parsedStatus)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: RealEstateMess.STATUS_INVALID,
                });
                return;
            }

            status = parsedStatus;
            whereObject["tinhtrang"] = status;
        }
        // End Find Status


        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await bat_dong_san.findAndCountAll({
            where: whereObject,
            limit,
            offset,
            raw: true
        });

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: rows,
            pagination: {
                currentPage: page,
                pageSize: limit,
                countRecord: count,
                totalPage: Math.ceil(count/limit)
            }
        })
      } catch (error) {
        console.log('Error in getList BDS: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [GET] /real-estate/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const bds = await bat_dong_san.findOne({
            where: {
                bdsid: id
            },
            raw: true
        })

        if(!bds) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNAUTHORIZED,
                message: RealEstateMess.ID_NOT_EXIST,
                errors: {
                    bdsid: RealEstateMess.ID_NOT_EXIST
                }
            })
            return;
        }

        const images = await hinh_bds.findAll({
            where: { bdsid: bds.bdsid },
            raw: true
        });

        const dshinhanh = [];
        if (images && images.length > 0) {
            images.forEach(item => dshinhanh.push(item['hinh']))
        }

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...bds,
                dshinhanh
            }
        })
      } catch (error) {
        console.log('Error in detail BDS: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /real-esate 
export const create = async (req: Request, res: Response) => {
    try {

        if(req.body.hinhanh.length <= 0) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.IMG_REQUIRED,
                errors: {
                    hinhanh: RealEstateMess.IMG_REQUIRED
                }
            })
            return;
        }

        let data: BDSCreationAttributes = {
            loaiid: req.body.loaiid,
            khid: req.body.khid,
            dientich: req.body.dientich,
            dongia: req.body.dongia,
            masoqsdd: req.body.masoqsdd,
            mota: req.body.mota??'',
            hinhanh: req.body.hinhanh[0],
            chieudai: req.body.chieudai,
            chieurong: req.body.chieurong,
            huehong: req.body.huehong,
            tenduong: req.body.tenduong,
            thanhpho: req.body.thanhpho,
            sonha: req.body.sonha,
            quan: req.body.quan,
            phuong: req.body.phuong
        }

        // Check loaiid
        const checkType = await loai_bds.findOne({
            where: {
                loaiid: data.loaiid
            }
        })
        if(!checkType) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.IDTYPE_INVALID,
                errors: {
                    loaiid: RealEstateMess.IDTYPE_INVALID
                }
            })
            return;
        }
        // Check loaiid

        // Check khid
        const checkCustomer = await khach_hang.findOne({
            where: {
                khid: data.khid
            }
        })
        if(!checkCustomer) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }
        // Check loaiid

        // Check MSQSDD
        const checkMSQSDD = await bat_dong_san.findOne({
            where: {
                masoqsdd: data.masoqsdd
            }
        })
        if(checkMSQSDD) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ASSET_CODE_EXIST,
                errors: {
                    masoqsdd: RealEstateMess.ASSET_CODE_EXIST
                }
            })
            return;
        }
        // End Check MSQSDD

        // check address
        const checkAddress = await bat_dong_san.findOne({
            where: {
                tenduong: {
                    [Op.like]: data.tenduong,
                }, 
                thanhpho: {
                    [Op.like]: data.thanhpho,
                }, 
                sonha: {
                    [Op.like]: data.sonha,
                }, 
                quan: {
                    [Op.like]: data.quan,
                }, 
                phuong: {
                    [Op.like]: data.phuong
                }, 
            }
        })
        if(checkAddress) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ADDRESS_EXIST,
                errors: {
                    tenduong: RealEstateMess.ADDRESS_EXIST,
                    thanhpho: RealEstateMess.ADDRESS_EXIST,
                    sonha: RealEstateMess.ADDRESS_EXIST,
                    quan: RealEstateMess.ADDRESS_EXIST,
                    phuong: RealEstateMess.ADDRESS_EXIST
                }
            })
            return;
        }
        // end check address

        const bdsmoi = await bat_dong_san.create(data)

        // Gán URL ảnh mới
        const dshinhanh = req.body.hinhanh
        if (dshinhanh && dshinhanh.length > 0) {
            dshinhanh.forEach(async (hinhanh) => {
                await hinh_bds.create({
                    bdsid: bdsmoi.bdsid,
                    hinh: hinhanh,
                });
            });
        }

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.CREATE_SUCCESS,
            data: bdsmoi.dataValues
        })
      } catch (error) {
        console.log('Error in create real-estate controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}

// [PUT] /real-esate/:id 
export const update = async (req: Request, res: Response) => {
    try {
        const idUpdate = req.params.id;

        const bdsUpdate = await bat_dong_san.findOne({
            where: {
                bdsid: idUpdate
            }, 
            raw: true
        })

        if(!bdsUpdate) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ID_NOT_EXIST,
                errors: {
                    bdsid: RealEstateMess.ID_NOT_EXIST
                }
            })
            return;
        }

        if(req.body.hinhanh.length <= 0) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.IMG_REQUIRED,
                errors: {
                    hinhanh: RealEstateMess.IMG_REQUIRED
                }
            })
            return;
        }

        let data: BDSCreationAttributes = {
            loaiid: req.body.loaiid,
            khid: req.body.khid,
            dientich: req.body.dientich,
            dongia: req.body.dongia,
            masoqsdd: req.body.masoqsdd,
            mota: req.body.mota??'',
            chieudai: req.body.chieudai,
            chieurong: req.body.chieurong,
            huehong: req.body.huehong,
            tenduong: req.body.tenduong,
            thanhpho: req.body.thanhpho,
            sonha: req.body.sonha,
            quan: req.body.quan,
            phuong: req.body.phuong
        }

        // Check loaiid
        const checkType = await loai_bds.findOne({
            where: {
                loaiid: data.loaiid
            }
        })
        if(!checkType) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.IDTYPE_INVALID,
                errors: {
                    loaiid: RealEstateMess.IDTYPE_INVALID
                }
            })
            return;
        }
        // Check loaiid

        // Check khid
        const checkCustomer = await khach_hang.findOne({
            where: {
                khid: data.khid
            }
        })
        if(!checkCustomer) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }
        // Check loaiid

        // Check msqsdd
        const checkMSQSDD = await bat_dong_san.findOne({
            where: {
                bdsid: {
                    [Op.ne]: bdsUpdate.bdsid
                },
                masoqsdd: data.masoqsdd
            }
        })
        if(checkMSQSDD) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ASSET_CODE_EXIST,
                errors: {
                    masoqsdd: RealEstateMess.ASSET_CODE_EXIST
                }
            })
            return;
        }
        // End Check msqsdd

        // check address
        const checkAddress = await bat_dong_san.findOne({
            where: {
                bdsid: {
                    [Op.ne]: bdsUpdate.bdsid
                },
                tenduong: {
                    [Op.like]: data.tenduong,
                }, 
                thanhpho: {
                    [Op.like]: data.thanhpho,
                }, 
                sonha: {
                    [Op.like]: data.sonha,
                }, 
                quan: {
                    [Op.like]: data.quan,
                }, 
                phuong: {
                    [Op.like]: data.phuong
                }, 
            }
        })
        if(checkAddress) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ADDRESS_EXIST,
                errors: {
                    tenduong: RealEstateMess.ADDRESS_EXIST,
                    thanhpho: RealEstateMess.ADDRESS_EXIST,
                    sonha: RealEstateMess.ADDRESS_EXIST,
                    quan: RealEstateMess.ADDRESS_EXIST,
                    phuong: RealEstateMess.ADDRESS_EXIST
                }
            })
            return;
        }
        // end check address

        // Xoá ảnh cũ
        const imagesDel = await hinh_bds.findAll({
            where: { bdsid: bdsUpdate.bdsid },
        });

        if (imagesDel && imagesDel.length > 0) {
            const imageUrls = imagesDel.map((img) => img['hinh']);

            await deleteImgCloud(imageUrls);

            await hinh_bds.destroy({
                where: { bdsid: bdsUpdate.bdsid },
            });
        }

        // Gán URL ảnh mới
        const dshinhanh = req.body.hinhanh
        data.hinhanh = req.body.hinhanh[0]
        if (dshinhanh && dshinhanh.length > 0) {
            dshinhanh.forEach(async (hinhanh) => {
                await hinh_bds.create({
                    bdsid: bdsUpdate.bdsid,
                    hinh: hinhanh,
                });
            });
        }

        await bat_dong_san.update(data, {
            where: {
                bdsid: bdsUpdate.bdsid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.UPDATE_SUCCESS,
        })
      } catch (error) {
        console.log('Error in update real-estate controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}