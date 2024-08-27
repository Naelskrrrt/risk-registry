import { useAuth } from "@/context/AuthProvider";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { PopoverContent } from "@nextui-org/popover";

const Profile = () => {
    const { user, logout } = useAuth();
    console.log(user);
    const handleLogout = async () => {
        try {
            const response = await logout();
            console.log("Logout response: ", response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <PopoverContent>
            <div className="w-[350px] h-[303px] p-5 py-7     flex flex-col items-center gap-8">
                <div className="flex flex-col gap-3 w-full items-center">
                    <img
                        src="/src/presentation/assets/image/avatar.png"
                        alt="un mini profile"
                        className="w-16"
                    />
                    <div className="flex w-full flex-col items-center ">
                        <h1 className="text-xl font-medium text-slate-950">
                            Bonjour, {user?.session} !
                        </h1>
                        <p className="text-slate-500 text-md font-regular">
                            {user?.stackholder_title}
                        </p>
                    </div>
                </div>
                <Button
                    className="w-full py-6 bg-danger-500/20 text-md font-medium text-danger-500 rounded"
                    onClick={handleLogout}
                    startContent={
                        <Icon
                            icon="solar:logout-2-outline"
                            className="font-semibold"
                            fontSize={"20px"}
                        />
                    }>
                    Se deconnécter
                </Button>
            </div>
            <p className="text-[10px] absolute   lg:bottom-3 left-15 bottom-5 text-center w-fit">
                Made with <span className="text-red-500">❤</span> by
                AccèsBanque, DevHub Fianarantsoa
            </p>
        </PopoverContent>
    );
};

export default Profile;
