import {Layer, Stage} from 'react-konva';
import {height, width} from "./ts/consts.ts";
import {useEffect, useState} from "react";
import Grid from "./components/Grid.tsx";
import Loading from "./components/Loading/Loading.tsx";


function App() {
    const [stageState, setStageState] = useState({scale: 1, x: 0, y: 0});
    const [pointerPos, setPointerPos] = useState({x: 0, y: 0});

    const handleWheel = (e: any): void => {
        e.evt.preventDefault();
        const scaleBy = 1.04;
        const minScale = 0.5;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const clampedScale = Math.max(minScale, newScale);

        setStageState({
            scale: clampedScale,
            x: (stage.getPointerPosition().x / clampedScale - mousePointTo.x) * clampedScale,
            y: (stage.getPointerPosition().y / clampedScale - mousePointTo.y) * clampedScale
        });
    };

    const handleMouseMove = (e: any): void => {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        const scale = stageState.scale;

        // Получаем актуальные позиции сцены
        const stageX = stage.x();
        const stageY = stage.y();

        // Вычисляем позицию курсора относительно сцены при учете масштаба
        setPointerPos({
            x: (pos.x - stageX) / scale,
            y: (pos.y - stageY) / scale,
        });
    };

    const handleDragStart = (): boolean => document.body.classList.toggle('grabbing');

    const handleDragEnd = (e: any): void => {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        const scale = stageState.scale;
        const stageX = stageState.x + stage.x(); // учитываем смещение сцены
        const stageY = stageState.y + stage.y(); // учитываем смещение сцены

        // Пересчитываем координаты курсора с учетом смещения сцены
        setPointerPos({
            x: (pos.x - stageX) / scale,
            y: (pos.y - stageY) / scale,
        });
        document.body.classList.toggle('grabbing');
    };

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/companystructure')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error')
                }
                return response.json();
            })
            .then(data => setData(data))
            .then(() => setLoading(false))
            .catch(err => console.error(err.message))
    }, []);

    if (isLoading) return <Loading/>

    return (
        <>
            <Stage
                x={stageState.x}
                y={stageState.y}
                width={width}
                height={height}
                scaleX={stageState.scale}
                scaleY={stageState.scale}
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
            >
                <Layer>
                    <Grid
                        data={data}
                        parentSize={{width, height}}
                        scale={stageState.scale}
                        pointerPos={pointerPos}
                    />
                </Layer>
            </Stage>
        </>
    )
}


export default App
