build:
	yarn
	cd ios && pod install && cd ..

clean:
	-rm *.lock
	-rm ios/*.lock

deep_clean:
	-rm *.lock
	-rm ios/*.lock
	-rm -rf Library/Developer/Xcode/DerivedData
	-rm -rf node_modules
	yarn cache clean
