app_name=files_rightclick
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(CURDIR)/build
sign_dir=$(build_dir)/artifacts
cert_dir=$(HOME)/.nextcloud/certificates

all: appstore

clean:
	rm -rf $(build_dir)

appstore: clean
	mkdir -p $(sign_dir)
	rsync -a \
	--exclude=.* \
	--exclude=build \
    --exclude=CONTRIBUTING.md \
	--exclude=composer.json \
	--exclude=composer.lock \
	--exclude=composer.phar \
	--exclude=l10n/.tx \
	--exclude=l10n/no-php \
	--exclude=Makefile \
	--exclude=screenshots \
	--exclude=phpunit*xml \
	--exclude=tests \
	--exclude=vendor/bin \
	$(project_dir) $(sign_dir)
	tar -czf $(build_dir)/$(app_name).tar.gz \
		-C $(sign_dir) $(app_name)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(build_dir)/$(app_name).tar.gz | openssl base64 > $(build_dir)/$(app_name).b64
	rm -rf $(build_dir)/artifacts
	cat $(build_dir)/$(app_name).b64 \
