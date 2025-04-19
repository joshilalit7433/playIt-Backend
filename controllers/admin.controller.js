import { Turf } from "../models/turf.model.js";

export const AdminDashboard = async (req, res) => {
  try {
    const pendingTurfs = await Turf.find({ status: "pending" })
      .populate("owner", "fullname email mobilenumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      turfs: pendingTurfs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching pending turfs",
      success: false,
    });
  }
};

export const getPendingTurfDetails = async (req, res) => {
  try {
    const { turfId } = req.params;

    const turf = await Turf.findById(turfId).populate(
      "owner",
      "fullname email mobilenumber"
    );

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
        success: false,
      });
    }

    return res.status(200).json({
      turf,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching turf details",
      success: false,
    });
  }
};

export const approveTurf = async (req, res) => {
  try {
    const { turfId } = req.params;

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
        success: false,
      });
    }

    turf.status = "approved";
    await turf.save();

    return res.status(200).json({
      message: "Turf approved successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error approving turf",
      success: false,
    });
  }
};

export const rejectTurf = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { reason } = req.body;

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({
        message: "Turf not found",
        success: false,
      });
    }

    turf.status = "rejected";
    turf.rejectionReason = reason || "Did not meet our requirements";
    await turf.save();

    return res.status(200).json({
      message: "Turf rejected successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error rejecting turf",
      success: false,
    });
  }
};
