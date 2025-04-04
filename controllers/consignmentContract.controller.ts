import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommonMess, ContractMess, CustomerMess, RealEstateMess } from "../constants/messages.constant";
import { hd_ky_gui, HDKyGui } from "../models/hd_ky_gui.model";
import { khach_hang } from "../models/khach_hang.model";
import { bat_dong_san } from "../models/bat_dong_san.model";
import { Op } from "sequelize";

// [GET] /consignment-contract/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject = {}

        // Find Status
        let status: number;
        const rawStatus = req.query.status;

        if (rawStatus === undefined || rawStatus === "") {
            status = 1;
        }  else {
            const parsedStatus = parseInt(rawStatus as string, 10);
            if (isNaN(parsedStatus) || ![0,1].includes(parsedStatus)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: ContractMess.STATUS_INVALID
                });
                return;
            }
            status = parsedStatus;
        }
        whereObject["trangthai"] = status;
        // End Find Status

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await hd_ky_gui.findAndCountAll({
            where: whereObject,
            limit,
            offset,
            raw: true
        });

        const returnRows = await Promise.all(
            rows.map(async (item) => {
                const khachhang = await khach_hang.findOne({
                    where: {
                        khid: item.khid
                    },
                    raw: true
                });

                const bds = await bat_dong_san.findOne({
                    where: {
                        bdsid: item.bdsid
                    },
                    raw: true
                })
                
                return {
                    ...item,
                    khachhang,
                    batdongsan: bds
                };
            })
        );

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: returnRows,
            pagination: {
                currentPage: page,
                pageSize: limit,
                countRecord: count,
                totalPage: Math.ceil(count/limit)
            }
        })
    } catch (error) {
        console.log('Error in get list consignment contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
    }
}

// [GET] /consignment-contract/:kgid
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.kgid);

        const hdkygui: HDKyGui = await hd_ky_gui.findOne({
            where: {
                khid: id
            },
            raw: true
        })

        if(!hdkygui) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.KGID_NOT_EXIST,
                errors: {
                    khid: ContractMess.KGID_NOT_EXIST
                }
            })
            return;
        }

        const khachhang = await khach_hang.findOne({
            where: {
                khid: hdkygui.khid
            },
            raw: true
        });

        const bds = await bat_dong_san.findOne({
            where: {
                bdsid: hdkygui.bdsid
            },
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...hdkygui,
                khachhang,
                batdongsan: bds
            }
        })
      } catch (error) {
        console.log('ErrorController Detail Consignment Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /consignment-contract 
export const create = async (req: Request, res: Response) => {
    try {
        // Check BDS
        const checkBDS = await bat_dong_san.findOne({
            where: {
                bdsid: req.body.bdsid
            },
            raw: true
        })
        if(!checkBDS) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ID_NOT_EXIST,
                errors: {
                    bdsid: RealEstateMess.ID_NOT_EXIST
                }
            })
            return;
        }

        const checkKG = await hd_ky_gui.findOne({
            where: {
                bdsid: checkBDS.bdsid,
                trangthai: 1
            }
        })

        if(checkKG) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: 'Bất động sản đã được ký gửi',
                errors: {
                    bdsid: 'Bất động sản đã được ký gửi'
                }
            })
            return;
        }
        // End Check BDS

        // Check Customer
        if(req.body.khid != checkBDS.khid) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: "BDS không thuộc quyền sở hữu của khách hàng này",
                errors: {
                    khid: "BDS không thuộc quyền sở hữu của khách hàng này"
                }
            })
            return;
        }
        // End Check Customer 

        

        // Check DATE
        if(req.body.ngaybatdau > req.body.ngayketthuc) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.DATE_INVALID,
                errors: {
                    ngaybatdau: ContractMess.DATE_INVALID,
                    ngayketthuc: ContractMess.DATE_INVALID,
                }
            })
            return;
        }
        // End Check DATE

        const newRow = await hd_ky_gui.create(req.body);

        res.status(StatusCodes.CREATED).json({
            code: StatusCodes.CREATED,
            message: CommonMess.CREATE_SUCCESS,
            data: {
                ...newRow.dataValues
            }
        })
      } catch (error) {
        console.log('Error in create consignment contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}

// [PUT] /consignment-contract/:kgid
export const update = async (req: Request, res: Response) => {
    try {
        const idUpdate = parseInt(req.params.kgid)

        const existRecord = await hd_ky_gui.findOne({
            where: {
                kgid: idUpdate
            }
        })

        if(!existRecord) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.KGID_NOT_EXIST,
                errors: {
                    bdsid: ContractMess.KGID_NOT_EXIST
                }
            })
            return;
        }

        // Check BDS
        const checkBDS = await bat_dong_san.findOne({
            where: {
                bdsid: req.body.bdsid
            },
            raw: true
        })
        if(!checkBDS) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ID_NOT_EXIST,
                errors: {
                    bdsid: RealEstateMess.ID_NOT_EXIST
                }
            })
            return;
        }

        const checkKG = await hd_ky_gui.findOne({
            where: {
                kgid: {
                    [Op.ne]: idUpdate
                },
                bdsid: checkBDS.bdsid,
                trangthai: 1
            }
        })

        if(checkKG) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: 'Bất động sản đã được ký gửi',
                errors: {
                    bdsid: 'Bất động sản đã được ký gửi'
                }
            })
            return;
        }
        // End Check BDS

        // Check Customer
        if(req.body.khid != checkBDS.khid) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: "BDS không thuộc quyền sở hữu của khách hàng này",
                errors: {
                    khid: "BDS không thuộc quyền sở hữu của khách hàng này"
                }
            })
            return;
        }
        // End Check Customer 

        // Check DATE
        if(req.body.ngaybatdau > req.body.ngayketthuc) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.DATE_INVALID,
                errors: {
                    ngaybatdau: ContractMess.DATE_INVALID,
                    ngayketthuc: ContractMess.DATE_INVALID,
                }
            })
            return;
        }
        // End Check DATE

        await hd_ky_gui.update(req.body, {
            where: {
                kgid: idUpdate
            }
        });

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.UPDATE_SUCCESS,
        })
      } catch (error) {
        console.log('Error in update consignment contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}
