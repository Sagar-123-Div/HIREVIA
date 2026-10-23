import express from "express" ;
import { getLandingData } from "../controllers/landingController.js";

const router = express.Router();

router.get("/", getLandingData);

export default router;