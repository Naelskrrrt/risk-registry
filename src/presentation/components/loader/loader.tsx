import "./loader.style.css";

const Loader = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-7 justify-center items-center">
            <span className="loader">
                <span className="loader-inner"></span>
            </span>
            <p className="font-bold text-lg text-nextblue-900 animate-fade">
                Chargement...
            </p>
        </div>
    );
};

export default Loader;
