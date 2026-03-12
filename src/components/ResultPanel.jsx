import ConfidenceBar from "./ConfidenceBar";

function ResultPanel({ prediction, confidence }) {

return (

```
<div style={styles.panel}>

  <h2>Analysis Result</h2>

  {!prediction && (
    <p style={{ opacity: 0.6 }}>
      Upload an image to see prediction
    </p>
  )}

  {prediction && (

    <>

      <h3>Prediction</h3>

      <p style={styles.prediction}>
        {prediction}
      </p>

      <h3>Confidence</h3>

      <ConfidenceBar value={confidence} />

      <div style={styles.info}>

        <h3>AI Explanation</h3>

        <p>
          This AI system analyzes cervical cell
          morphology patterns from Pap smear
          images. It assists screening but does
          not replace professional diagnosis.
        </p>

      </div>

    </>

  )}

</div>
```

);

}

const styles = {

panel: {
background: "rgba(255,255,255,0.05)",
padding: "30px",
borderRadius: "16px",
border: "1px solid rgba(255,255,255,0.1)"
},

prediction: {
fontSize: "24px",
color: "#38bdf8"
},

info: {
marginTop: "25px",
padding: "20px",
background: "rgba(255,255,255,0.05)",
borderRadius: "10px"
}

};

export default ResultPanel;
