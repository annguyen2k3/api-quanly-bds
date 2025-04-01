import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loai_bds } from "../models/loai_bds.model";
import { CommonMess } from "../constants/messages.constant";

// [GET] /type-real-estate/list
export const getList = async (req: Request, res: Response) => {
    try {
        const list = await loai_bds.findAll({
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: list
        })
      } catch (error) {
        console.log('Error in get list TypeEstate controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}
