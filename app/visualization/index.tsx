import VisualizationView from "./visualization-view";
import VisualizationContainer from "./VisualizationContainer";

const Visualization = () => {
  return (
    <VisualizationContainer>
      {(props) => <VisualizationView {...props} />}
    </VisualizationContainer>
  );
};

export default Visualization;
