---
title: "Test your site on a mobile device locally."
excerpt: When first starting out building responsibe web sites, you may find testing your sites on mobile devices to be cumbersome.
---

When first starting out building responsibe web sites, you may find testing your sites on mobile devices to be cumbersome.

The problem lies with Chrome's developer tools (and others like it). It's a simulator, not an actual device, and a pretty poor one at that. You can trust it just as far as you can throw it (which you can't ... because it isn't a physical object ...).

So you gotta use an actual device. The cumbersome part for new developers is that they actually go through the entire deployment process while testing their mobile device. The workflow might look like:

1. Make some changes to the site
2. Commit, push, deploy to production
3. Open the production site on a mobile device. Debug, make changes.
4. Rinse, repeat.

Pretty poor process. Not only are you mucking around in production just to test changes- this takes a long time!

Instead, you can just run the site locally, as usual. If your mobile device and your computer are connected to the same network, you can simply connect to your computer using it's local IP address.

In your terminal, type `ifconfig` or `ipconfig` (depending on your OS).

You want your computer's LAN IPv4 address.

### windows (`ipconfig`)
<pre>
> ipconfig

Windows IP Configuration


Ethernet adapter Ethernet:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :

Wireless LAN adapter Local Area Connection* 2:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :

Wireless LAN adapter Local Area Connection* 3:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :

Ethernet adapter Ethernet 2:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :

Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::d17:173:178a:7e92%8
   IPv4 Address. . . . . . . . . . . : <u><b>192.168.1.166</b></u>
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Ethernet adapter Bluetooth Network Connection:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
</pre>

### osx (`ifconfig | grep inet`)

<pre>
inet 127.0.0.1 netmask 0xff000000 
inet6 ::1 prefixlen 128 
inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
inet6 fe80::843:dbd7:dea3:1b85%en0 prefixlen 64 secured scopeid 0x4 
inet <u><b>192.168.1.89</b></u> netmask 0xffffff00 broadcast 192.168.1.255
inet6 fe80::50da:4dff:fe7f:208c%awdl0 prefixlen 64 scopeid 0x9 
inet6 fe80::79de:34c1:b4de:f94b%utun0 prefixlen 64 scopeid 0xa
</pre>

On your phone's browser, use that IP address as the hostname, followed by the port your server is using.

Example: `http://192.168.1.89:3000`

You should now see your site! If you don't, ensure that 1) both devices are on the same network and 2) your firewall is allowing the connection.
