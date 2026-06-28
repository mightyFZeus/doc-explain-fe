import { Composition } from "remotion";
import { DocExplainDemo } from "./DocExplainDemo";
import "./styles.css";

export function RemotionRoot() {
  return (
    <Composition
      component={DocExplainDemo}
      durationInFrames={1980}
      fps={30}
      height={1080}
      id="DocExplainDemo"
      width={1920}
    />
  );
}
