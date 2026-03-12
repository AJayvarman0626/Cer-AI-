import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";

function ProbabilityChart({ data }) {

return (

<div style={styles.wrapper}>

  <h3 style={styles.title}>
    Class Probability Distribution
  </h3>

  <ResponsiveContainer width="100%" height={320}>

    <BarChart data={data}>

      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

      <XAxis
        dataKey="name"
        stroke="#94a3b8"
      />

      <YAxis
        stroke="#94a3b8"
        domain={[0,100]}
      />

      <Tooltip
        contentStyle={{
          background:"#020617",
          border:"1px solid #334155",
          color:"white"
        }}
      />

      <Bar
        dataKey="probability"
        fill="#38bdf8"
        radius={[6,6,0,0]}
      />

    </BarChart>

  </ResponsiveContainer>

</div>

);

}

const styles = {

wrapper:{
marginTop:"40px",
background:"rgba(255,255,255,0.05)",
padding:"25px",
borderRadius:"14px",
border:"1px solid rgba(255,255,255,0.06)"
},

title:{
marginBottom:"20px"
}

};

export default ProbabilityChart;