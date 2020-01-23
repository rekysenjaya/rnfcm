/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firebase, { Notification, NotificationOpen } from 'react-native-firebase';

const fcmNow = () => {
  firebase.auth()
    .signInAnonymously()
    .then(credential => {
      if (credential) {
        console.log('default app user ->', credential.user.toJSON());
      }
    });
}

const getToken = async () => {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    console.log(fcmToken)
  }
}

const checkPermission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
}

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    getToken();
  } catch (error) {
    console.log('permission rejected');
  }
}

const createNotificationListeners = async () => {
  firebase.notifications().onNotification(notification => {
    notification.android.setChannelId('insider').setSound('default')
    firebase.notifications().displayNotification(notification)
  });
}

const appCloseFcm = () => {
  firebase.notifications().getInitialNotification((notification: Notification) => {
    // Process your notification as required
    console.log(notification)
  });
}

const App = () => {
  useEffect(() => {
    fcmNow()
    const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    firebase.notifications().android.createChannel(channel);
    checkPermission();
    createNotificationListeners();
    appCloseFcm()
    return () => {
      appCloseFcm()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
