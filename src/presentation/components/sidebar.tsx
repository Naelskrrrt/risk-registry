import {
    RISKS_IA_NAVIGATION,
    RISKS_IT_NAVIGATION,
    USER_MANAGEMENT_NAVIGATION,
} from "@/constants/global-nav"; // Importez les constantes
import { useAuth } from "@/context/AuthProvider";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importez useLocation

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRisksIAOpen, setIsRisksIAOpen] = useState(false);
    const [isRisksITOpen, setIsRisksITOpen] = useState(false);
    const location = useLocation(); // Utilisez useLocation pour obtenir l'URL actuelle
    const { user } = useAuth();

    const submenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
    };

    // Fonction pour vérifier si le lien est actif
    const isLinkActive = (path: string) => location.pathname.startsWith(path);

    return (
        <aside
            className={`${
                isCollapsed ? "w-[96px]" : "w-[300px]"
            } h-full sticky border-2 border-white bg-white/30 backdrop-blur-sm px-2 rounded-md flex flex-col transition-all duration-300 ease-in-out`}>
            <div className="h-[71.13px] w-full flex items-center px-3 relative flex-col ">
                <div className="w-full h-full relative flex">
                    <img
                        src="/src/presentation/assets/icon/logo.svg"
                        alt="logo"
                        className={`sm:w-[114.24px] justify-start ${
                            isCollapsed ? "hidden" : "block"
                        }`}
                    />
                </div>
                <img
                    src="/src/presentation/assets/icon/logo-min.png"
                    alt="logo min"
                    className={`sm:w-8 sm:h-8 ${
                        isCollapsed ? "block" : "hidden"
                    }`}
                />
                <img
                    src="/src/presentation/assets/icon/expand_icon.svg"
                    alt="expand"
                    className={`w-6 absolute -right-5 top-5 cursor-pointer ${
                        isCollapsed && "rotate-180"
                    }`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />
            </div>
            <div className="mt-8 w-full h-fit flex flex-col gap-1">
                {/* Risks Identification & Assessment */}
                {(user?.role_id === 3 || user?.role_id === 1) && (
                    <Link
                        to={RISKS_IA_NAVIGATION.submenus[0].path}
                        className={`flex w-full items-center gap-1 py-2 px-3 rounded-md transition-all ease-in-out cursor-pointer ${
                            isLinkActive(
                                RISKS_IA_NAVIGATION.submenus[0].path
                            ) ||
                            isLinkActive(RISKS_IA_NAVIGATION.submenus[1].path)
                                ? "bg-nextblue-100/50 text-nextblue-500 font-semibold"
                                : "text-slate-500 font-medium"
                        }`}
                        onClick={() => setIsRisksIAOpen(!isRisksIAOpen)}>
                        <div className="flex p-2">
                            <Icon
                                icon={RISKS_IA_NAVIGATION.icon}
                                fontSize={"28px"}
                            />
                        </div>
                        {!isCollapsed && (
                            <>
                                <span className="text-sm font-medium w-full">
                                    {RISKS_IA_NAVIGATION.label}
                                </span>
                                <div className="flex">
                                    <Icon
                                        icon={
                                            isRisksIAOpen
                                                ? "solar:alt-arrow-down-outline"
                                                : "solar:alt-arrow-right-outline"
                                        }
                                        fontSize={20}
                                    />
                                </div>
                            </>
                        )}
                    </Link>
                )}
                <AnimatePresence initial={false}>
                    {isRisksIAOpen && !isCollapsed && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={submenuVariants}
                            className="ml-8 flex flex-col gap-1 overflow-hidden bg-slate-50/70 border-l-4 border-nextblue-500 pl-4 py-2">
                            {RISKS_IA_NAVIGATION.submenus.map(
                                (submenu, index) => (
                                    <div
                                        key={index}
                                        className={`flex w-full items-center gap-3  py-2 px-3 rounded-md transition-all ease-in-out cursor-pointer ${
                                            isLinkActive(submenu.path)
                                                ? "bg-nextblue-50 text-nextblue-500"
                                                : "text-slate-600 hover:bg-white/80 "
                                        }`}>
                                        <div className="flex p-2">
                                            <Icon
                                                icon={submenu.icon}
                                                fontSize={"24px"}
                                            />
                                        </div>
                                        <Link
                                            to={submenu.path}
                                            className="text-[14px] font-medium w-full">
                                            {submenu.label}
                                        </Link>
                                    </div>
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Risks IT */}
                {(user?.role_id === 2 || user?.role_id === 1) && (
                    <Link
                        to={RISKS_IT_NAVIGATION.submenus[0].path}
                        className={`flex w-full items-center gap-1 py-2 px-3 rounded-md transition-all ease-in-out cursor-pointer ${
                            isLinkActive(
                                RISKS_IT_NAVIGATION.submenus[0].path
                            ) ||
                            isLinkActive(RISKS_IT_NAVIGATION.submenus[1].path)
                                ? "bg-nextblue-100/50 text-nextblue-500 font-semibold"
                                : "text-slate-500 font-medium"
                        }`}
                        onClick={() => setIsRisksITOpen(!isRisksITOpen)}>
                        <div className="flex p-2">
                            <Icon
                                icon={RISKS_IT_NAVIGATION.icon}
                                fontSize={"28px"}
                            />
                        </div>
                        {!isCollapsed && (
                            <>
                                <span className="text-sm font-medium w-full">
                                    {RISKS_IT_NAVIGATION.label}
                                </span>
                                <div className="flex">
                                    <Icon
                                        icon={
                                            isRisksITOpen
                                                ? "solar:alt-arrow-down-outline"
                                                : "solar:alt-arrow-right-outline"
                                        }
                                        fontSize={20}
                                    />
                                </div>
                            </>
                        )}
                    </Link>
                )}
                <AnimatePresence initial={false}>
                    {isRisksITOpen && !isCollapsed && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={submenuVariants}
                            className="ml-8 flex flex-col gap-1 overflow-hidden bg-slate-50/70 border-l-4 border-nextblue-500 pl-4 py-2">
                            {RISKS_IT_NAVIGATION.submenus.map(
                                (submenu, index) => (
                                    <div
                                        key={index}
                                        className={`flex w-full items-center gap-3  py-2 px-3 rounded-md transition-all ease-in-out cursor-pointer hover:bg-white/80 ${
                                            isLinkActive(submenu.path)
                                                ? "bg-nextblue-50 text-nextblue-500"
                                                : "text-slate-600"
                                        }`}>
                                        <div className="flex p-2">
                                            <Icon
                                                icon={submenu.icon}
                                                fontSize={"24px"}
                                            />
                                        </div>
                                        <span className="text-[14px] font-medium w-full">
                                            {submenu.label}
                                        </span>
                                    </div>
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gestion Utilisateurs */}
                {user?.role_id === 1 && (
                    <Link
                        to={USER_MANAGEMENT_NAVIGATION.path}
                        className={`flex w-full items-center gap-1 py-2 px-3 rounded-md transition-all ease-in-out cursor-pointer ${
                            isLinkActive(USER_MANAGEMENT_NAVIGATION.path)
                                ? "bg-nextblue-100/50 text-nextblue-500 font-semibold"
                                : "text-slate-500 font-medium"
                        }`}>
                        <div className="flex p-2">
                            <Icon
                                icon={USER_MANAGEMENT_NAVIGATION.icon}
                                fontSize={"28px"}
                            />
                        </div>
                        {!isCollapsed && (
                            <span className="text-sm  w-full">
                                {USER_MANAGEMENT_NAVIGATION.label}
                            </span>
                        )}
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
