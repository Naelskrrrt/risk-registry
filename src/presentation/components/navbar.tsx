// import React from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger } from "@nextui-org/popover";
import Profile from "./profile";

const Navbar = () => {
    return (
        <div className="w-full h-16 flex items-center justify-end ">
            <Popover placement={"bottom-end"} color="secondary">
                <PopoverTrigger>
                    <Button
                        className="bg-slate-50/20 backdrop-blur-sm border-1 border-white/60 rounded-2xl gap-3 -px-1"
                        startContent={
                            <Icon
                                icon="solar:hamburger-menu-outline"
                                fontSize="18px"
                                className="text-white"
                            />
                        }>
                        <img
                            src="/src/presentation/assets/icon/avatar.svg"
                            alt="un mini profile"
                            className="w-7"
                        />
                    </Button>
                </PopoverTrigger>

                <Profile />
            </Popover>
        </div>
    );
};

export default Navbar;
