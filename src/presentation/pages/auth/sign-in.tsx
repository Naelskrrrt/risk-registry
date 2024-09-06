import { useSignInForm } from "./hooks/useSignInForm";

import useAuthRedirect from "@/hooks/useAuthRedirect";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Toaster } from "sonner";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        toggleVisibility,
        onSubmit,
        isVisible,
        isSubmitting,
        errors,
    } = useSignInForm();

    useAuthRedirect();

    return (
        <div className="bg-bg-pattern w-full h-screen bg-cover flex flex-col items-center justify-center overflow-y-auto">
            <div className="container flex justify-center">
                <div className="w-fit h-[700px] border-2 rounded-xl bg-slate-50/30 backdrop-blur-sm flex items-center overflow-hidden p-1 gap-6">
                    <div className="flex w-full h-full relative flex-col items-center lg:items-start p-3 px-8 py-4">
                        <form className="w-full relative flex items-center justify-center lg:items-start py-2 flex-col gap-14">
                            <img
                                src="/src/presentation/assets/icon/logo.svg"
                                alt="logo"
                                className="sm:w-36 w-32"
                            />
                            <div className="w-[450px] flex flex-col items-center lg:items-start gap-6">
                                <h1 className="sm:text-5xl text-3xl font-display">
                                    Connectez-vous !
                                </h1>
                                <p className="sm:text-lg text-md font-normal text-slate-500 text-center lg:text-left">
                                    Pour commencer, vous devez d’abord vous
                                    connecter. Veuillez renseigner votre
                                    identifiant.
                                </p>
                            </div>
                            <div className="w-full flex items-center justify-center lg:justify-start">
                                <div className="flex flex-col min-w-96 w-[500px] flex-wrap md:flex-nowrap gap-4">
                                    <Input
                                        {...register("session")}
                                        label="Session"
                                    />
                                    {errors.session && (
                                        <div className="text-red-500">
                                            {errors.session.message}
                                        </div>
                                    )}
                                    <Input
                                        {...register("password")}
                                        label="Password"
                                        variant="flat"
                                        size="md"
                                        endContent={
                                            <button
                                                className="focus:outline-none relative bottom-1"
                                                type="button"
                                                onClick={toggleVisibility}
                                                aria-label="toggle password visibility">
                                                <Icon
                                                    icon={
                                                        isVisible
                                                            ? "solar:eye-outline"
                                                            : "solar:eye-closed-outline"
                                                    }
                                                    fontSize={22}
                                                    className="text-2xl text-default-400 pointer-events-none"
                                                />
                                            </button>
                                        }
                                        type={isVisible ? "text" : "password"}
                                    />
                                    {errors.password && (
                                        <div className="text-red-500">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                className={`w-96 mt-4 ${
                                    isSubmitting
                                        ? "bg-slate-400"
                                        : "bg-blue-500"
                                } text-slate-50 font-medium text-md`}
                                variant="solid"
                                size="lg"
                                isLoading={isSubmitting}
                                startContent={
                                    <Icon icon={"solar:login-2-outline"} />
                                }>
                                Se Connecter
                            </Button>
                            {errors.root && (
                                <div className="text-red-500">
                                    {errors.root.message}
                                </div>
                            )}
                        </form>
                    </div>
                    <img
                        src="/src/presentation/assets/image/image-auth.png"
                        alt="auth"
                        className="h-full hidden lg:block"
                    />
                    <p className="text-[11px] absolute  w-full lg:bottom-3 lg:left-10 bottom-5 text-center lg:w-fit">
                        Made with <span className="text-red-500">❤</span> by
                        AccèsBanque
                    </p>
                </div>
            </div>
            <Toaster position="top-right" closeButton richColors />
        </div>
    );
};

export default SignIn;
