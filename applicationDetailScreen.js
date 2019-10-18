/*
 * Copyright (c) 2017-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { oauth, net } from "react-native-force";
import { Card } from "react-native-material-ui";
import StepIndicator from "react-native-step-indicator";

const labels = ["NEW APPLICATION", "QUALIFICATION", "VERIFICATION", "CLOSING"];

const message = [
  "At a first stage of the loan application process, your loan application has been successfully created. Our loan officers are working on your application and will get in touch with you on the next steps",
  "This stage lets you know whether your application qualifies for further process or not. If it qualifies then loan officers will get back to you on next steps",
  "This stage is when your lender verifies that all of your information in the application is correct. You may be asked to provide additional documnets. You may want to go to the TO-DO page to sign documents."
];

const statusMessage = [
  "Stage 1 was completed on June 18, 2019",
  "Stage 2 will be completed by June 28, 2019",
  "Stage 3 will be complete by July 10, 2019"
];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013"
};

class ApplicationDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.state = { active: "home" };
    this.state = {
      currentPosition: 1
    };
  }

  componentDidMount() {
    var that = this;
    oauth.getAuthCredentials(
      () => that.fetchData(), // already logged in
      () => {
        oauth.authenticate(
          () => that.fetchData(),
          error => console.log("Failed to authenticate:" + error)
        );
      }
    );
  }

  fetchData() {
    var that = this;
    net.query(
      "select id, genesis__Overall_Status__c , Name from genesis__applications__c where id ='a5Y3k0000004BuHEAU' LIMIT 1",
      response => that.setState({ data: response.records })
    );
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <Card>
                <Text style={styles.item}>{item.Name}</Text>
                <StepIndicator
                  customStyles={customStyles}
                  currentPosition={this.state.currentPosition}
                  labels={labels}
                  stepCount="4"
                />
                <Text style={styles.item}>
                  {message[this.state.currentPosition]}
                </Text>
                <Text style={styles.status}>
                  {statusMessage[this.state.currentPosition]}
                </Text>
              </Card>
            )}
            keyExtractor={(item, index) => "key_" + index}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "white"
  },
  item: {
    padding: 10,
    fontSize: 18
  },

  status: {
    padding: 10,
    fontSize: 14,
    color: "green"
  }
});

export default ApplicationDetailScreen;
