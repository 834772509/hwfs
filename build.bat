@echo off
cd /d %~dp0

cargo build --release
cargo build --release --target=i686-pc-windows-msvc

rem Add UPX
IF EXIST upx.exe (
    upx "%cd%\target\release\hwfs.exe" --best --compress-resources=0 --strip-relocs=0 --compress-icons=0 --compress-exports=0 --lzma
    upx "%cd%\target\i686-pc-windows-msvc\release\hwfs.exe" --best --compress-resources=0 --strip-relocs=0 --compress-icons=0 --compress-exports=0 --lzma
)

rd "%cd%\target\release\hwfs.exe"
rd "%cd%\target\i686-pc-windows-msvc\release\hwfs.exe"

rename "%cd%\target\release\hwfs.exe" "hwfs-x64.exe"
rename "%cd%\target\i686-pc-windows-msvc\release\hwfs.exe" "hwfs-x86.exe"

start "" "%cd%\target\release"
start "" "%cd%\target\i686-pc-windows-msvc\release"
