import ThreeDComponent from "./ModelsReviewer/index.tsx";
import SceneLoader from "./ModelsReviewer/components/SceneLoader.tsx";

const App = () => {
    return (
        <main className="relative w-full h-screen overflow-hidden bg-zinc-50">
            <SceneLoader />
            <ThreeDComponent />
        </main>
    );
}

export default App;