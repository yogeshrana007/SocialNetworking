import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "user doesn't found!" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "some error" });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        const imageUrl = req.file.path; // Cloudinary URL
        const publicId = req.file.filename; // Cloudinary public_id

        res.status(200).json({ imageUrl, publicId });
    } catch (err) {
        res.status(500).json({ error: "Upload failed", details: err });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("req.files ===>", req.files);
        const userId = req.userId;
        let {
            firstName,
            lastName,
            userName,
            headline,
            location,
            gender,
            skills,
            education,
            experience,
        } = req.body;

        // Ensure skills is a clean flat array of strings
        if (skills && typeof skills === "string") {
            skills = JSON.parse(skills); // if sent as string
        }

        if (Array.isArray(skills)) {
            skills = skills.flat().map((skill) => skill.trim());
        } else {
            skills = [];
        }

        if (education && typeof education === "string") {
            education = JSON.parse(education);
        }

        if (experience && typeof experience === "string") {
            experience = JSON.parse(experience);
        }

        let profileImage;
        let coverImage;

        if (req.files?.profileImage?.[0]) {
            profileImage = {
                url: req.files.profileImage[0].path,
                publicId: req.files.profileImage[0].filename,
            };
        }

        if (req.files?.coverImage?.[0]) {
            coverImage = {
                url: req.files.coverImage[0].path,
                publicId: req.files.coverImage[0].filename,
            };
        }

        let updateData = {
            firstName,
            lastName,
            userName,
            headline,
            location,
            gender,
            skills,
            education,
            experience,
        };
        // Only add images if uploaded
        if (profileImage) updateData.profileImage = profileImage;
        if (coverImage) updateData.coverImage = coverImage;

        let user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true } // return updated doc
        ).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "update profile error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const search = async (req, res) => {
    try {
        let { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "query is required" });
        }
        let users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
            ],
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error seach user", error);
        return res.status(500).json({ message: "search error" });
    }
};
