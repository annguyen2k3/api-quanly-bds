import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommonMess, ContractMess, CustomerMess, RealEstateMess } from "../constants/messages.constant";
import { hd_chuyen_nhuong, HDChuyenNhuong } from "../models/hd_chuyen_nhuong.model";
import { khach_hang, KhachHang } from "../models/khach_hang.model";
import { bat_dong_san, BatDongSan } from "../models/bat_dong_san.model";
import { hd_dat_coc, HDDatCoc } from "../models/hd_dat_coc.model";
import { depositContractStatus, realEstateStatus } from "../constants/enums";
import { nhan_vien } from "../models/nhan_vien.model";
import { Sequelize, QueryTypes } from "sequelize";
import  sequelize  from "../config/database"

// [GET] /transfer-contract/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject: Record<string, any> = {
            trangthai: 1
        };

        // Find Status
        let status: number | undefined = undefined;
        const rawStatus = req.query.status;

        if (rawStatus !== undefined && rawStatus !== "") {
            const parsedStatus = parseInt(rawStatus as string, 10);

            if (isNaN(parsedStatus) || ![0,1].includes(parsedStatus)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: ContractMess.STATUS_INVALID,
                });
                return;
            }

            status = parsedStatus;
            whereObject["trangthai"] = status;
        }
        // End Find Status

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await hd_chuyen_nhuong.findAndCountAll({
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

                const tiendatcoc = await hd_dat_coc.findOne({
                    where: {
                        dcid: item.dcid
                    }
                })
                
                return {
                    ...item,
                    tiendatcoc: tiendatcoc.giatri,
                    khachhang,
                    batdongsan: bds,
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
        console.log('Error in get list transfer contract controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
    }
}

// [GET] /transfer-contract/:cnid
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.cnid);

        const hdchuyennhuong: HDChuyenNhuong = await hd_chuyen_nhuong.findOne({
            where: {
                cnid: id
            },
            raw: true
        })

        if(!hdchuyennhuong) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.CNID_NOT_EXIST,
                errors: {
                    cnid: ContractMess.CNID_NOT_EXIST
                }
            })
            return;
        }

        const khachhang = await khach_hang.findOne({
            where: {
                khid: hdchuyennhuong.khid
            },
            raw: true
        });

        const bds = await bat_dong_san.findOne({
            where: {
                bdsid: hdchuyennhuong.bdsid
            },
            raw: true
        })

        const hddatcoc = await hd_dat_coc.findOne({
            where: {
                dcid: hdchuyennhuong.dcid
            },
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...hdchuyennhuong,
                hddatcoc,
                khachhang,
                batdongsan: bds
            }
        })
      } catch (error) {
        console.log('ErrorController Detail Deposit Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /transfer-contract
export const create = async (req: Request, res: Response) => {
    try {
        // check hddc
        const hddatcoc: HDDatCoc = await hd_dat_coc.findOne({
            where: {
                dcid: req.body.dcid
            }
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

        if(hddatcoc.tinhtrang != depositContractStatus.DEPOSITED) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.CONTRACT_EXPIRED,
                errors: {
                    dcid: ContractMess.CONTRACT_EXPIRED
                }
            })
            return;
        }
        // end check hddc

        const row = await hd_chuyen_nhuong.create({
            dcid: hddatcoc.dcid,
            khid: hddatcoc.khid,
            bdsid: hddatcoc.bdsid,
            giatri: req.body.giatri
        })

        await hd_dat_coc.update({
            tinhtrang: depositContractStatus.COMPLETED
        }, {
            where: {
                dcid: row.dcid
            }
        })

        await bat_dong_san.update({
            tinhtrang: realEstateStatus.SOLD
        }, {
            where: {
                bdsid: row.bdsid
            }
        })

        await sequelize.query(
            `
            UPDATE nhan_vien nv
            JOIN khach_hang kh ON nv.nvid = kh.nvid
            SET nv.doanhthu = nv.doanhthu + ?
            WHERE kh.khid = ?
            `,
            {
              replacements: [req.body.giatri, hddatcoc.khid],
              type: QueryTypes.UPDATE,
            }
          );
          

        res.status(StatusCodes.CREATED).json({
            code: StatusCodes.CREATED,
            message: CommonMess.CREATE_SUCCESS,
            data: {
                ...row.dataValues
            }
        })
      } catch (error) {
        console.log('ErrorController Create transfer Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [PUT] /transfer-contract 
export const deleteContract = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.cnid);

        const hdchuyennhuong: HDChuyenNhuong = await hd_chuyen_nhuong.findOne({
            where: {
                cnid: id
            },
            raw: true
        })

        if(!hdchuyennhuong) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: ContractMess.CNID_NOT_EXIST,
                errors: {
                    cnid: ContractMess.CNID_NOT_EXIST
                }
            })
            return;
        }

        await hd_chuyen_nhuong.update({
            trangthai: 0
        }, {
            where: {
                cnid: hdchuyennhuong.cnid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.DELETE_SUCCESS,
        })
      } catch (error) {
        console.log('ErrorController Delete Deposit Contract: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}