---
title: "rust: Cargo SSL Link Error - missing symbols"
description: "A cute ssl linkage error, thought was nice to write about."
date: 2025-10-08
tags: ["rust", "ssl", "error", "linker"]
---

I decided to record the steps I took to solve the issue I found when on my app with the rust [openssl](https://github.com/rust-openssl/rust-openssl) crate

the issue I faced was not because of the `openssl` crate but because of [boring-ssl](https://github.com/cloudflare/boring/tree/master)

---

while developing a side project I required some depenecies, the instrusting dependencies are [jwt-simple](https://crates.io/crates/jwt-simple), and [reqwest](https://crates.io/crates/reqwest)

while in development mode, everything worked fine, my app was building successfully (didn't test _release_ build) and no issues. then I needed to delete my _/target_ file that cargo creates, after coming back to continue development of the project I faced this scary error
```sh
error: linking with `cc` failed: exit status: 1
  |
  = note:  "cc" "-m64" "/tmp/rustcNgwz7Z/symbols.o" "<257 object files omitted>" "-Wl,--as-needed" "-Wl,-Bstatic" "/home/.../breaking-rooster/target/debug/deps/{libreqwest-e4561bd8f02149cc.rlib,libhyper_rustls-38c71fbb2ae7226b.rlib,libwebpki_roots-4ea30a36b53553ff.rlib,libhyper_tls-a8996c8366e4fb2f.rlib,libtokio_native_tls-8590f29621b5f38a.rlib,libtokio_rustls-265509ff9a8ea7c4.rlib,librustls-52a9227633b19b31.rlib,libwebpki-2ba169a91f4a3113.rlib,libring-a0f7730f9e5b0e80.rlib,libuntrusted-402d8a5e7cbaa4ac.rlib,librustls_pki_types-be637176d38951e4.rlib,libtower_http-c2210fee92b324a3.rlib,libiri_string-355aca6384b25e9d.rlib,libtower-0ce30d02906b788b.rlib,libtower_layer-fb970fc424bc056b.rlib,libnative_tls-c42d77644da71268.rlib,libopenssl_probe-8baf43b58e99bc70.rlib,libopenssl-827ad20070375750.rlib,libforeign_types-7c7ea7131617a363.rlib,libforeign_types_shared-025187099289953f.rlib,libopenssl_sys-59717dad66b68f79.rlib,libhyper_util-ccde6af741f392f1.rlib,libipnet-b03a910fd36c6cba.rlib,libtower_service-0909c2a9c1d80fc0.rlib,libhyper-6551349e41e69f3c.rlib,libwant-2dea3ef5eeab5bd0.rlib,libtry_lock-6aa4eb608e84327f.rlib,libh2-75b574619c7a3369.rlib,libatomic_waker-043576979f9c2dc4.rlib,libhttp_body_util-2b6bace2a88080e6.rlib,libhttp_body-1b42d18f82512790.rlib,libhttp-fd08e5b85a6d3a91.rlib,libsync_wrapper-8cf9d0350cac2bc9.rlib,libjwt_simple-524da661a6889566.rlib,libblake2b_simd-f9d2d505572d0fde.rlib,libconstant_time_eq-d143995f49aecef3.rlib,libarrayvec-09139da729dfc177.rlib,libarrayref-ac36cf551a6d851d.rlib,libed25519_compact-0ecee17e8ef60309.rlib,libthiserror-47f1cd7ed5db0e9f.rlib,libanyhow-b53629dca006cee2.rlib,libcoarsetime-310a9196fcdf8574.rlib,libboring-d8fef3c238fe008a.rlib,libboring_sys-b14ad774783856a9.rlib,libforeign_types-0743590fd106859c.rlib,libforeign_types_shared-d0cbc1603ae7d22c.rlib,librand-67baf06dade32f14.rlib,librand_chacha-b1a7ba6bf9d66069.rlib,libhmac_sha512-2a9e3f52cea8965e.rlib,libp384-c33d423f8fe451ab.rlib,libk256-cd6c89187f3436ee.rlib,libp256-77aa78332d0a9ff0.rlib,libecdsa-a81793ba0e834184.rlib,librfc6979-b8cf9fad74638752.rlib,libsignature-4025cf40abab64c3.rlib,libprimeorder-4b30437f453c6644.rlib,libelliptic_curve-73de8317dfd9d14d.rlib,libsec1-3bd67ed138943a6f.rlib,libpkcs8-5864790d74855332.rlib,libspki-ed75969546024aad.rlib,libder-cca3923calf03244f.rlib,libpem_rfc7468-aebf52c8a09d5268.rlib,libbase64ct-a1659e7429f55600.rlib,libhkdf-0f7bdc01f58182bc.rlib,libcrypto_bigint-7831d00bdb927a20.rlib,libbase16ct-c39159fdcb62dd4a.rlib,libgroup-58ca52d6bef0091f.rlib,libff-8f29be1d84db6e1d.rlib,librand_core-222566b72b203aa0.rlib,libgetrandom-e6b928f00ca66d6e.rlib,libhmac_sha256-14a60d35bb2c2df9.rlib,libhmac_sha1_compact-ef28f7b57d65f59f.rlib,libct_codecs-1e6b0d67bea137c1.rlib,libdeadpool_postgres-29f9744a43ae4435.rlib,libdeadpool-6aaadfffac6d32b7.rlib,libnum_cpus-d1c605f14a60f173.rlib,liblazy_static-56fe2bd04ed1ed5a.rlib,libdeadpool_runtime-1058d11dfead7138.rlib,libtokio_postgres-5717346428ad9d02.rlib,libphf-227aef2fa9fe199d.rlib,libphf_shared-d3a5b381b740fb35.rlib,libsiphasher-d737ba0dfb65bc63.rlib,libwhoami-ff1e2654d50c70ef.rlib,libfutures_channel-6c917ebfef4960e9.rlib,libpostgres_types-5a7195a67dc4be4f.rlib,libuuid-322bf4abb61c6e4e.rlib,libpostgres_protocol-fcde709edge0728b1.rlib,libstringprep-e908220529961a7e.rlib,libunicode_properties-697455cd98d8f134.rlib,libunicode_normalization-92237764167864bd.rlib,libtinyvec-a96d1d3ed50e70c2.rlib,libtinyvec_macros-70acbbddddceb387.rlib,libunicode_bidi-c1f63059c8114eae.rlib,libsha2-2e148a88199905ae.rlib,libhmac-732869ab95093120.rlib,libmd5-0bdb1b51ef282b54.rlib,libbyteorder-fcc84cb3db99adfd.rlib,libfallible_iterator-07170b732f9e4770.rlib,libactix_web-8a4deddc5a0fce05.rlib,libimpl_more-864d6011652ab15c.rlib,liburl-36461ef058ac20ab.rlib,libidna-7calf2da2fca767cc.rlib,libutf8_iter-1646c222d18795bc.rlib,libidna_adapter-c392f9b653cce14d.rlib,libicu_properties-ce7dccd3193986c2.rlib,libicu_properties_data-26d6bc399092fe94.rlib,libicu_normalizer-e6dac635e657bd70.rlib,libicu_normalizer_data-10d4466f9c43328a.rlib,libicu_collections-a4e47468fd536f78.rlib,libpotential_utf-fcc38c5ff2a1341a.rlib,libicu_provider-f00820e2b62fe07d.rlib,libicu_locale_core-c75c4b2bd9be9877.rlib,libtinystr-ec5a5ce171ced7b0.rlib,liblitemap-f02678973ab870c3.rlib,libwriteable-8c24c1369e214f0e.rlib,libzerovec-165dd62edf37af76.rlib,libzerotrie-5c0726b103f82b4e.rlib,libyoke-eb6565aca7dd7cdf.rlib,libstable_deref_trait-483df2b595801479.rlib,libzerofrom-9e9848968fc6a055.rlib,libserde_urlencoded-16284a92c515815a.rlib,libform_urlencoded-a92d36b6abbbbe5d.rlib,libserde_json-54ada2320212bd5e.rlib,libryu-be08ec97f016dca5.rlib,libactix_server-dcb0de8f401aeaf5.rlib,libsocket2-2ff9e7e06bd3f34e.rlib,libactix_router-c7ea9cc506db4c55.rlib,libregex-c4b836e72d8b583f.rlib,libregex_automata-a42acf8addad3d41.rlib,libaho_corasick-139d85adfb7963e6.rlib,libregex_syntax-38544bba31373860.rlib,libserde-6195ac3f4fba5d2b.rlib,libserde_core-4fbce2b8a260e33e.rlib,libcookie-f88de0c506c41c44.rlib,libtime-dc739e5343f54314.rlib,libtime_core-ed3df36c8ddaec0b.rlib,libnum_conv-32d6eac4a4ee2854.rlib,libderanged-cb7884355d42d739.rlib,libpowerfmt-d1ada82b8dc0c228.rlib,libactix_http-1844f1fbbb4d9682.rlib,librand-a2dc09055dd403af.rlib,librand_chacha-d372e3229cb72abe.rlib,libppv_lite86-dd40a5cf2a4820e9.rlib,libzerocopy-7db7172387c7eccb.rlib,librand_core-ff76fc48b2b35177.rlib,libgetrandom-33968438e39d5ed8.rlib,libhttparse-dc2e0617c808faa4.rlib,libbrotli-fee28a6006c2ccd7.rlib,libbrotli_decompressor-195ee1ce73442aa3.rlib,liballoc_stdlib-6ae40a708b466ee4.rlib,liballoc_no_stdlib-7b4cee6bfd310af9.rlib,libhttpdate-946d3e277d3583c3.rlib,libsha1-fc81afd949d6f81f.rlib,libcpufeatures-6c9ff56478c3457e.rlib,libdigest-b59a1db445939f1b.rlib,libsubtle-0ee334d1c4be2997.rlib,libconst_oid-7f449c0434a8bb8c.rlib,libblock_buffer-039fcaa0bc149d8c.rlib,libcrypto_common-badc1460bee86a12.rlib,libgeneric_array-f4e778469ad6d3ed.rlib,libtypenum-b0614e77cf510445.rlib,libzeroize-cedf0ee6a993cf5b.rlib,libbase64-70a16982e7098fb8.rlib,liblocal_channel-3bf9a693be612e59.rlib,libbytestring-55e270bc88ff2659.rlib,libencoding_rs-2cfaec25fb8d4c9a.rlib,liblanguage_tags-ab61fec5eebad79b.rlib,libfoldhash-b992ebde20b9b2d4.rlib,libmime-0618cee41a07b099.rlib,libpercent_encoding-ca1e1a209395334d.rlib,libh2-1e0c7ce4f32ce4e5.rlib,libindexmap-489cfa71702c6030.rlib,libequivalent-c9924c04fe614d45.rlib,libhashbrown-265a5ae2bd03087e.rlib,libslab-81da68cc61213232.rlib,libfutures_util-377854d622b1b987.rlib,libfutures_task-088ca36a2e53102b.rlib,libpin_utils-93dac4c4b85627d3.rlib,libzstd-0af8165ead3eb50e.rlib,libzstd_safe-8a78e976216aab6c.rlib,libzstd_sys-f794abe86f252ef0.rlib,libflate2-6e945449f3854888.rlib,libminiz_oxide-5ab5c672b1c77344.rlib,libsimd_adler32-b5b7c4fc5df99cbf.rlib,libcrc32fast-268fd092bc801361.rlib,libactix_service-9a67f87a09f16b2e.rlib,libactix_codec-91fb02218b66a6e0.rlib,libtracing-94a405cf1c7cbac3.rlib,libtracing_core-30991a8e2b097227.rlib,libonce_cell-e8d785443e198b06.rlib,libmemchr-d7d96a1aa0988640.rlib,libbitflags-cb237a88189457c4.rlib,libtokio_util-babc0b54290a35f0.rlib,libfutures_sink-1723cb0f18bb1567.rlib,libderive_more-3342aafe8f846207.rlib,libactix_utils-b92388dff2c663b0.rlib,liblocal_waker-7a76ff8bc6dd16f3.rlib,libactix_rt-482a592dae9a5e1e.rlib,libtokio-54497180ca0c2ea0.rlib,libsignal_hook_registry-6450f6e7e9b1c178.rlib,libsocket2-7bee761e2bd0492a.rlib,libmio-f2614808ad33f7bd.rlib,liblog-ef41a40bb7c5defe.rlib,libparking_lot-8579417be687fe45.rlib,libparking_lot_core-79c1a4eb0408c7c2.rlib,liblibc-eabc9ad1814123b2.rlib,libcfg_if-56bf4e36be24c5b6.rlib,libsmallvec-a423e45a2d3c98dc.rlib,liblock_api-df0bc79d39674829.rlib,libscopeguard-faaabf9a734bce39.rlib,libpin_project_lite-3786854cc47c19bc.rlib,libfutures_core-c5ea581cad5c901d.rlib,libhttp-864c945ef65b9382.rlib,libitoa-37c5ecc59978b7f6.rlib,libbytes-fe12ffb83ad42758.rlib,libfnv-71fc6b195d346bd0.rlib,libdotenv_codegen-d4327556a9e29c37.rlib}.rlib" "<sysroot>/lib/rustlib/x86_64-unknown-linux-gnu/lib/{libstd-*,libpanic_unwind-*,libobject-*,libmemchr-*,libaddr2line-*,libgimli-*,librustc_demangle-*,libstd_detect-*,libhashbrown-*,librustc_std_workspace_alloc-*,libminiz_oxide-*,libadler2-*,libunwind-*,libcfg_if-*,liblibc-*,liballoc-*,librustc_std_workspace_core-*,libcore-*,libcompiler_builtins-*}.rlib" "-Wl,-Bdynamic" "-lssl" "-lcrypto" "-lstdc++" "-lgcc_s" "-lutil" "-lrt" "-lpthread" "-lm" "-ldl" "-lc" "-Wl,--eh-frame-hdr" "-Wl,-z,noexecstack" "-L" "/home/.../breaking-rooster/target/debug/build/zstd-sys-34e89b33f47616e8/out" "-L" "/home/.../breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/crypto/" "-L" "/home/.../breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/ssl/" "-L" "/home/.../breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/" "-L" "/home/.../breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build" "-L" "/home/.../breaking-rooster/target/debug/build/ring-8b1bb3bff1be2c73/out" "-L" "<sysroot>/lib/rustlib/x86_64-unknown-linux-gnu/lib" "-o" "/home/.../breaking-rooster/target/debug/deps/breaking_rooster-61de4d2194351271" "-Wl,--gc-sections" "-pie" "-Wl,-z,relro,-z,now" "-nodefaultlibs"
  = note: some arguments are omitted. use `--verbose` to show all linker arguments
  = note: /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_read_uninit':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3795:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$15ssl_read_uninit17h5a76f670e5f0b1a9E+0x7b): undefined reference to `SSL_read_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_read_uninit':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3795:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$15ssl_read_uninit17h85168dc4145e7129E+0x7b): undefined reference to `SSL_read_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_read_uninit':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3795:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$15ssl_read_uninit17hf7ee3e2cbc3e3022E+0x7b): undefined reference to `SSL_read_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_write':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3836:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$9ssl_write17h1d6d676c1dbf5cc9E+0x7b): undefined reference to `SSL_write_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_write':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3836:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$9ssl_write17h7763fc36642dbfaeE+0x7b): undefined reference to `SSL_write_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libreqwest-e4561bd8f02149cc.rlib(reqwest-e4561bd8f02149cc.reqwest.c4ace1a50d6286c8-cgu.04.rcgu.o): in function `openssl::ssl::SslStream<S>::ssl_write':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:3836:(.text._ZN7openssl3ssl18SslStream$LT$S$GT$9ssl_write17hd7e75c8911d385c9E+0x7b): undefined reference to `SSL_write_ex'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl-827ad20070375750.rlib(openssl-827ad20070375750.openssl.cbda864fcea19a7c-cgu.01.rcgu.o): in function `openssl::ssl::SslRef::peer_certificate':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/ssl/mod.rs:2568:(.text._ZN7openssl3ssl6SslRef16peer_certificate17h9d8c65b38567ec04E+0x18): undefined reference to `SSL_get1_peer_certificate'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl-827ad20070375750.rlib(openssl-827ad20070375750.openssl.cbda864fcea19a7c-cgu.06.rcgu.o): in function `openssl::error::Error::get':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-0.10.74/src/error.rs:122:(.text._ZN7openssl5error5Error3get17hefb2bd422f4712c3E+0x5d): undefined reference to `ERR_get_error_all'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl_sys-59717dad66b68f79.rlib(openssl_sys-59717dad66b68f79.openssl_sys.2b718429cf7fa2df-cgu.0.rcgu.o): in function `openssl_sys::openssl::ssl::SSL_CTX_set_mode':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-sys-0.9.110/src/./ssl.rs:242:(.text._ZN11openssl_sys7openssl3ssl16SSL_CTX_set_mode17hc8f84054178188baE+0x1c): undefined reference to `SSL_CTX_ctrl'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl_sys-59717dad66b68f79.rlib(openssl_sys-59717dad66b68f79.openssl_sys.2b718429cf7fa2df-cgu.0.rcgu.o): in function `openssl_sys::openssl::ssl::SSL_CTX_add_extra_chain_cert':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-sys-0.9.110/src/./ssl.rs:398:(.text._ZN11openssl_sys7openssl3ssl28SSL_CTX_add_extra_chain_cert17hc3b0bcd7c2118600E+0x1c): undefined reference to `SSL_CTX_ctrl'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl_sys-59717dad66b68f79.rlib(openssl_sys-59717dad66b68f79.openssl_sys.2b718429cf7fa2df-cgu.0.rcgu.o): in function `openssl_sys::openssl::tls1::SSL_set_tlsext_host_name':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-sys-0.9.110/src/./tls1.rs:23:(.text._ZN11openssl_sys7openssl4tls124SSL_set_tlsext_host_name17hfa994417aadafcfbE+0x1c): undefined reference to `SSL_ctrl'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl_sys-59717dad66b68f79.rlib(openssl_sys-59717dad66b68f79.openssl_sys.2b718429cf7fa2df-cgu.0.rcgu.o): in function `openssl_sys::openssl::ssl::SSL_CTX_set_min_proto_version':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-sys-0.9.110/src/./ssl.rs:482:(.text._ZN11openssl_sys7openssl3ssl29SSL_CTX_set_min_proto_version17hebd0a219adf46983E+0x1b): undefined reference to `SSL_CTX_ctrl'
          /usr/bin/ld: /home/.../breaking-rooster/target/debug/deps/libopenssl_sys-59717dad66b68f79.rlib(openssl_sys-59717dad66b68f79.openssl_sys.2b718429cf7fa2df-cgu.0.rcgu.o): in function `openssl_sys::openssl::ssl::SSL_CTX_set_max_proto_version':
          /home/dsal3389/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/openssl-sys-0.9.110/src/./ssl.rs:491:(.text._ZN11openssl_sys7openssl3ssl29SSL_CTX_set_max_proto_version17h8f6ab41d586ca52cE+0x1b): undefined reference to `SSL_CTX_ctrl'
          collect2: error: ld returned 1 exit status

  = note: some `extern` functions couldn't be found; some native libraries may need to be installed or have their path specified
  = note: use the `-l` flag to specify native libraries to link
  = note: use the `cargo:rustc-link-lib` directive to specify the native libraries to link with Cargo (see https://doc.rust-lang.org/cargo/reference/build-scripts.html#rustc-link-lib)

warning: `breaking-rooster` (bin "breaking-rooster") generated 9 warnings
error: could not compile `breaking-rooster` (bin "breaking-rooster") due to 1 previous error; 9 warnings emitted
```

a linkage error, recently I updated my system, maybe `libssl` was also update with *BREAKING CHANGES?* doesn't make sense, but I checked
it anyway, no, no breaking changes were introduced in recent `libssl`

## looking for the issue source

I checked my `libssl.so` for some of the missing signatures, and it looked like it does exists in my `libssl.so`
```sh
>>> nm -D libssl.so | grep -E "(SSL_read_ex|SSL_write_ex)"
0000000000027ab0 T SSL_read_ex@@OPENSSL_3.0.0
0000000000028220 T SSL_write_ex@@OPENSSL_3.0.0
0000000000028200 T SSL_write_ex2@@OPENSSL_3.3.0
```

so my `libssl.so` file is fine, it should build like last time,
I really wasn't sure what happened, I didn't touch the project, one of rust features
is if you compile it once it will be compiled every time (unlike javascript projects ehm ehm)

I started looking into the `openssl` crate maybe some new commits in their `build.rs` broke in the linkage, that wasn't it

I decided to run the `build` command with `-vv`
>  -v, --verbose...               Use verbose output (-vv very verbose/build.rs output)

so I executed
```
>>> cargo build --vv | tee build.output
```

and started to diagnose the _build.output_ file for the `"openssl"` string, to see the crate build message and I found
```
[openssl-sys 0.9.110] cargo:rustc-link-lib=ssl
[openssl-sys 0.9.110] cargo:rustc-link-lib=crypto
```

nothing weird here, this is a way to [tell rustc to link a given library](https://doc.rust-lang.org/cargo/reference/build-scripts.html#rustc-link-lib), it what expect from the `openssl` crate,
and then in the _build.output_ file I looked for just `"ssl"` string, I saw a lot of messages coming from some weird crate called `boring-sys`
```
<snip>
[boring-sys 4.19.0] cargo:rustc-link-search=native=/home/dsal3389/programming/breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build
[boring-sys 4.19.0] cargo:rustc-link-lib=stdc++
[boring-sys 4.19.0] cargo:rustc-link-lib=static=crypto
[boring-sys 4.19.0] cargo:rustc-link-lib=static=ssl
<snip>
```

I started to investigate this crate build messages and... I saw it... the source of the issue, this `boring-sys` crate
is building a different ssl library and it is found in a higher priority directory
```
<snip>
[boring-sys 4.19.0] [ 98%] Building CXX object CMakeFiles/ssl.dir/src/ssl/tls13_server.cc.o
[boring-sys 4.19.0] [ 98%] Building CXX object CMakeFiles/ssl.dir/src/ssl/tls_method.cc.o
[boring-sys 4.19.0] [ 98%] Building CXX object CMakeFiles/ssl.dir/src/ssl/tls_record.cc.o
[boring-sys 4.19.0] [100%] Linking CXX static library libssl.a
[boring-sys 4.19.0] [100%] Built target ssl
<snip>
[boring-sys 4.19.0] cargo:rustc-link-search=native=/home/dsal3389/programming/breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/crypto/
[boring-sys 4.19.0] cargo:rustc-link-search=native=/home/dsal3389/programming/breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/ssl/
<snip>
[boring-sys 4.19.0] cargo:rustc-link-search=native=/home/dsal3389/programming/breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/crypto/
[boring-sys 4.19.0] cargo:rustc-link-search=native=/home/dsal3389/programming/breaking-rooster/target/debug/build/boring-sys-4d87a7c529c387fd/out/build/ssl/
```

that means if ill check that build `ssl` file, I will find that it doesn't contain the signatures that are missing
for the `openssl` crate
```
>>> cd target/debug/build/boring-sys-4d87a7c529c387fd/out/build
>>> nm libssl.a | grep -E "(SSL_read_ex|SSL_write_ex)"
```

no output, which means, this `boring-sys` which overwrite my system `ssl` library for the linker
is the cause of the issue, now the question is who introduced this `boring-sys` crate?

after a quick search in `Cargo.lock` turns out it was the `jwt-simple` crate, luckily someone before me already faced it or the maintainer just knew it
and he had a section to resolve those `boring` conflicts
> As a temporary workaround for portability issues with one of the dependencies (the boring crate), this library can be compiled to use only Rust implementations.
> In order to do so, import the crate with default-features = false, features = ["pure-rust"] in your Cargo configuration.
