## Air pressure bot

## setup&deploy

``` shell
firebase projects:list
firebase use projectName
firebase functions:config:set line.channelaccesstoken="The Accen Token" line.channelsecret="The Secret" 
firebase deploy 
```

## local emulate

``` shell
npm install
firebase functions:config:get > .runtimeconfig.json
npm run serve
```

# local debug

``` shell
npm run debug
```
F5
