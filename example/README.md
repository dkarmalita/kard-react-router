```sh
git clone https://github.com/dkarmalita/template-react.git
cd template-react
npx ./scripts/app-init.sh
# npx ./scripts/app-clean.sh
```

* react@^16.5.2,
* webpack@4, 
* babel@7
* sass (scss) support
* jest@^23.6.0
* eslint@^5.10.0
* stylelint@^9.9.0

## Customization`

npm add mobx mobx-react

## Tips

### clone with submodules

git clone --recurse-submodules -j8 https://gitlab.com/Hojyman/devapp-react-form-engine.git

### add submodule

git submodule add https://github.com/dkarmalita/kard-react-store.git packages/@kard/react-store
