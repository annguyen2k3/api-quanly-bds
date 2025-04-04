import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommonMess, ContractMess, CustomerMess, RealEstateMess } from "../constants/messages.constant";
import { hd_dat_coc, HDDatCoc } from "../models/hd_dat_coc.model";
import { khach_hang, KhachHang } from "../models/khach_hang.model";
import { bat_dong_san, BatDongSan } from "../models/bat_dong_san.model";
import { realEstateStatus } from "../constants/enums";
import { hd_ky_gui } from "../models/hd_ky_gui.model";
import { where } from "sequelize";

// [GET] /deposit-contract/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject = {}

        // Find Status
        if(req.query.status) {
            const statusFind = parseInt(req.query.status as string, 10)
            whereObject['tinhtrang'] = statusFind
        }
        // End Find Status

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await hd_dat_coc.findAndCountAll({
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
        console.log('Error in get list deposit contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
    }
}

// [GET] /deposit-contract/:dcid
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.dcid);

        const hddatcoc: HDDatCoc = await hd_dat_coc.findOne({
            where: {
                dcid: id
            },
            raw: true
        })

        if(!hddatcoc) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.DCID_NOT_EXIST,
                errors: {
                    dcid: ContractMess.DCID_NOT_EXIST
                }
            })
            return;
        }

        const khachhang = await khach_hang.findOne({
            where: {
                khid: hddatcoc.khid
            },
            raw: true
        });

        const bds = await bat_dong_san.findOne({
            where: {
                bdsid: hddatcoc.bdsid
            },
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...hddatcoc,
                khachhang,
                batdongsan: bds
            }
        })
      } catch (error) {
        console.log('ErrorController Detail Deposit Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /deposit-contract
export const create = async (req: Request, res: Response) => {
    try {
        // check bds
        const bds: BatDongSan = await bat_dong_san.findOne({
            where: {
                bdsid: req.body.bdsid
            }
        })

        if(!bds) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.ID_NOT_EXIST,
                errors: {
                    bdsid: RealEstateMess.ID_NOT_EXIST
                }
            })
            return;
        }

        if(bds.tinhtrang != realEstateStatus.ACTIVE) {
            switch (bds.tinhtrang) {
                case realEstateStatus.EXPIRED:
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                        code: StatusCodes.UNPROCESSABLE_ENTITY,
                        message: RealEstateMess.EXPIRED,
                        errors: {
                            bdsid: RealEstateMess.EXPIRED
                        }
                    })
                    return;

                case realEstateStatus.DEPOSITED:
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                        code: StatusCodes.UNPROCESSABLE_ENTITY,
                        message: RealEstateMess.DEPOSITED,
                        errors: {
                            bdsid: RealEstateMess.DEPOSITED
                        }
                    })
                    return;

                case realEstateStatus.SOLD:
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                        code: StatusCodes.UNPROCESSABLE_ENTITY,
                        message: RealEstateMess.SOLD,
                        errors: {
                            bdsid: RealEstateMess.SOLD
                        }
                    })
                    return;
            
                default:
                    break;
            }
        }
        // end check bds

        // check customer
        const customer: KhachHang = await khach_hang.findOne({
            where: {
                khid: req.body.khid
            }
        })

        if(!customer) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }

        if(customer.khid == bds.khid) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.BUYER_NOT_SELLER,
                errors: {
                    khid: CustomerMess.BUYER_NOT_SELLER
                }
            })
            return;
        }
        // end check customer

        const row = await hd_dat_coc.create({...req.body})

        await hd_ky_gui.update({
            trangthai: 0
        }, {
            where: {
                bdsid: row.bdsid
            }
        })

        await bat_dong_san.update({
            tinhtrang: realEstateStatus.DEPOSITED
        }, {
            where: {
                bdsid: row.bdsid
            }
        })

        res.status(StatusCodes.CREATED).json({
            code: StatusCodes.CREATED,
            message: CommonMess.CREATE_SUCCESS,
            data: {
                ...row.dataValues
            }
        })
      } catch (error) {
        console.log('ErrorController Create Deposit Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [PUT] /deposit-contract/cancel/:dcid
export const cancel = async (req: Request, res: Response) => {
    try {
        const idUpdate = parseInt(req.params.dcid)

        const existRecord: HDDatCoc = await hd_dat_coc.findOne({
            where: {
                dcid: idUpdate
            },
            raw: true
        })

        if(!existRecord) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.DCID_NOT_EXIST,
                errors: {
                    bdsid: ContractMess.DCID_NOT_EXIST
                }
            })
            return;
        }

        await hd_dat_coc.update({ tinhtrang: 0 }, {
            where: {
                dcid: existRecord.dcid
            }
        })

        await hd_ky_gui.update({trangthai: 1} , {
            where: {
                bdsid: existRecord.bdsid
            }
        })

        await bat_dong_san.update({ tinhtrang: realEstateStatus.ACTIVE }, {
            where: {
                bdsid: existRecord.bdsid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: ContractMess.CANCEL_SUCCESSED,
        })
      } catch (error) {
        console.log('Error in cancel deposit contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}
