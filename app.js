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
import { BottomNavigation } from "react-native-material-ui";
import {
  Themed,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  ScrollView
} from "react-navigation";
import {
  createStackNavigator,
  NavigationStackScreenProps,
  NavigationStackProp
} from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Toolbar } from "react-native-material-ui";

import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { oauth, net } from "react-native-force";
import ApplicationScreen from "./applicationScreen";
import ApplicationDetailScreen from "./applicationDetailScreen";
import { Icon } from "react-native-material-ui";

class ContactListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.state = { active: "home" };
    this.state = { selectedApp: "" };
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
    net.query("SELECT Id, Name FROM Contact LIMIT 10", response =>
      that.setState({ data: response.records })
    );
  }

  displayComponent() {
    if (this.state.active === "home") {
      return (
        <ApplicationScreen
          handleAppDetail={this.displayApplicationDetail.bind(this)}
        />
      );
    } else if (this.state.active === "detail") {
      return <ApplicationDetailScreen appId={this.state.selectedApp} />;
    } else {
      return <Text> Welcome! </Text>;
    }
  }

  displayApplicationDetail(item, e) {
    var that = this;
    that.setState({ active: "detail" });
    that.setState({ selectedApp: item });
  }

  render() {
    return (
      <>
        <Toolbar
          leftElement="menu"
          centerElement="Texas First Bank"
          searchable={{
            autoFocus: true,
            placeholder: "Search"
          }}
          rightElement={{
            menu: {
              icon: "more-vert",
              labels: ["LogIn", "LogOut"]
            }
          }}
          onRightElementPress={label => {
            console.log(label);
          }}
        />
        <View style={styles.container}>{this.displayComponent()}</View>
        <BottomNavigation active={this.state.active}>
          <BottomNavigation.Action
            key="home"
            icon="home"
            label="Home"
            onPress={() => this.setState({ active: "home" })}
          />
          <BottomNavigation.Action
            key="person"
            icon="person"
            label="Profile"
            onPress={() => this.setState({ active: "person" })}
          />
          <BottomNavigation.Action
            key="bookmark-border"
            icon="bookmark-border"
            label="Bookmark"
            onPress={() => this.setState({ active: "bookmark-border" })}
          />
          <BottomNavigation.Action
            key="settings"
            icon="settings"
            label="Settings"
            onPress={() => this.setState({ active: "settings" })}
          />
        </BottomNavigation>
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
    fontSize: 18,
    height: 44
  }
});

export const App = ContactListScreen;
