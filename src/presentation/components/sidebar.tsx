"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSidenavItems from "@/constants/navigations";
import SignOutButton from "./sign-out-button";
import { useLoading } from "@/context/loadingContext";

const SideNav = () => {
    const { loading } = useLoading();
    const SIDENAV_ITEM = useSidenavItems();
    return (
        <>
            {!loading && (
                <div className="w-[300px]  h-screen flex-1 fixed flex border-r flex-col justify-between">
                    <div className="flex flex-col space-y-6 w-full">
                        <Link
                            href="/dashboard"
                            className="flex flex-row space-x-3 items-center justify-start px-6  h-[75px] w-full ">
                            <span className="h-10 w-10 border-2 border-zinc-300 rounded-lg flex items-center justify-center">
                                <Icon icon="lucide:anchor" width={26} />
                            </span>
                            <span className="font-bold text-xl">E-Leave</span>
                        </Link>

                        <div className="flex flex-col space-y-3 md:px-6 ">
                            {SIDENAV_ITEM.map((item, idx) => {
                                return <MenuItem key={idx} item={item} />;
                            })}
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            )}
        </>
    );
};

export default SideNav;

const MenuItem = ({ item }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="mt-10">
            {item.submenu ? (
                <>
                    <hr />
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full mt-5 justify-between hover:bg-zinc-100 dark:hover:bg-slate-600/45 ${
                            pathname.includes(item.path)
                                ? "bg-zinc-100 dark:bg-slate-600/25 font-semibold"
                                : ""
                        }`}>
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className=" text-[18px]  flex">
                                {item.title}
                            </span>
                        </div>

                        <div
                            className={`${
                                subMenuOpen ? "rotate-180" : ""
                            } flex`}>
                            <Icon
                                icon="lucide:chevron-down"
                                width="24"
                                height="24"
                            />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`flex gap-3 items-center ${
                                            subItem.path === pathname
                                                ? "font-bold"
                                                : ""
                                        }`}>
                                        {subItem.icon}
                                        <span className="text-[15px]">
                                            {subItem.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-600/45 ${
                        item.path === pathname
                            ? "bg-zinc-100 dark:bg-slate-600/25 font-bold"
                            : ""
                    }`}>
                    {item.icon}
                    <span className="text-[18px] flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};
