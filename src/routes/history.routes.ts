import { Router } from "express";
import {
    showdatabyfilter
} from "../controllers/history.controller.js";

const router = Router();

router.post("/showdata", showdatabyfilter);



export default router;