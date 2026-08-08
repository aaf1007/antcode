import { Router } from "express";

const userRouter = Router();


const users = [
    {id: 1, name: "Thant Hayman Thway", age: 21, school: "SFU", baby: "Anton"},
    {id:2 , name: "Anton Florendo", age: 24, school: "SFU", baby: "Hayman"},
];

userRouter.get("/", (req, res) => {
    res.status(200).json(users);
});

userRouter.get("/:userId", (req, res) => {
    const id = Number(req.params.userId);
    const user = users.find((cur) => cur.id === id);

    // User DNE
    if (!user) {
        res.status(401).json({error: "User Not Found"});
    }

    res.status(200).json(user);
});

export default userRouter;