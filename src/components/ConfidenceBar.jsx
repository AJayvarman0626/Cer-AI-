function ConfidenceBar({ value }) {

return (

```
<div style={styles.wrapper}>

  <div
    style={{
      ...styles.bar,
      width: value + "%"
    }}
  >
    {value}%
  </div>

</div>
```

);

}

const styles = {

wrapper: {
background: "#020617",
borderRadius: "10px",
overflow: "hidden",
marginTop: "10px"
},

bar: {
background: "linear-gradient(90deg,#22c55e,#4ade80)",
padding: "10px",
textAlign: "center",
transition: "width 0.6s"
}

};

export default ConfidenceBar;
