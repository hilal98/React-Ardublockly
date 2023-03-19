import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";
import * as Blockly from "blockly" 
import Breadcrumbs from "../Breadcrumbs";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import {bagdes} from "./die_badges"; 

class BadgesHome extends Component {

  render() {
    return (
    <div>
        <Breadcrumbs
        content={[{ link: "/badges/BadgesHome", title: Blockly.Msg.badges_head }]}/>
      <Container fixed >
        <div>
          <h1>{Blockly.Msg.badges_head}</h1>
        </div>
        <div style={{ margin: "0px 24px 0px 24px" }}>
            <Typography> {Blockly.Msg.badges_tutoriallink1} {" "}
            <Link to = {"/tutorial"}>
                {Blockly.Msg.badges_tutoriallink}
            </Link> {" "}
            {Blockly.Msg.badges_tutoriallink2}
            </Typography>
        </div>
        <br></br>
        <div style= {{ display: "flex"}}>
          {bagdes.map((data, key)  => {
            key= {key}
            return (
             <a href={data.openBadgeId}><img width= "50%" src = {data.image} title={data.name} alt = "Fehler"/> </a>
            );
          })}
        </div>
        <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.history.push("/");
                }}
              >
                {Blockly.Msg.button_back}
        </Button>
      </Container>
    </div>

    )
  }
}

export default withRouter(BadgesHome);
