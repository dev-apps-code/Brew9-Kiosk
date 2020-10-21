# How to upgrade for android compability
1. Upgrade to expo 28 sdk 
2. migrate to androidX
3. Fix issue 1 by 1
4. Fix react native fast image link by doing manual link
- make sure follow https://github.com/vbanurag/react-native-fast-image/blob/master/docs/installation-manual.md
and there is no error

5. Update app.json iosexpoviewurl and androidexpoviewurl
6. Use yarn instead of npm

# How to solve android apk generate issue
1. Add yarn release command to package.json
2. Basically go through all my build Gradle settings
3. update all Gradle version  to 4.1.0
4. remove fabric from build Gradle
5. fix a few more errors if anything came out.
6. fix all error at android manifest by removing  those lines since I don't think they are in used
7. android manifest add android banner -> choose a random logo for it
8. remove android.useDeprecatedNdk=true from gradle.properties
9. find packaging option and replace it
    packagingOptions {
        pickFirst '**/META-INFMANIFEST.MF'
    }
10. Update all dependencies to proper version as recommended
11. Dependency for react native is wrongly set -> "react-native": "https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz",
12. update react-native to 38

# To check
1. Just copy paste package.json and remove package.lock and also yarn.lock, and rerun yarn
2. also make sure app/build.gradle follow same as androidfixreleqaseapk branch
3. Make sure mainactitivy.java no error. android studio got hint to do whatever needed, please learn to use it
4. make sure androidmanifest no error


# Every deployment 
1. expo bundle-assets --platform android --dest ./android/app/src/main/assets
2. run yarn release
3. android studio - clean build
4. android studio - generate apk

