/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTPushNotificationManager.h"

#import "AppDelegate.h"

#import "RCTRootView.h"

#import "RNQuickActionManager.h"

@implementation AppDelegate

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded)) completionHandler {
  [RNQuickActionManager onQuickActionPress:shortcutItem completionHandler:completionHandler];
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `192.168.1.11` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */

  jsCodeLocation = [NSURL URLWithString:@"http://10.0.0.7:8081/index.ios.bundle?platform=ios&dev=false"];

  /**
   * OPTION 2
   * Load from pre-bundled file on disk. The static bundle is automatically
   * generated by "Bundle React Native code and images" build step.
   */

  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"kanxidian_app"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  //UIView *loadingView = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //loadingView.backgroundColor = [UIColor whiteColor];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  //rootView.loadingView = loadingView;
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  rootView.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
