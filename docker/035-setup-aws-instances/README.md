To deploy the **010-single-machine** scenario:

- create an instance of **z1d.2xlarge** with an EBS volume of 800GB (each Analysis will take more or less 7GB);

- configure it;

- reboot;

- create a **/data/docker** folder, change ownership to ubuntu:ubuntu;

- with **fdisk**, locate the EBS volume and format it:

```Shell
mkfs -t ext4 /dev/xxx
```

- with **blkid**, find out the UUID of the volume:

```Shell
blkid /dev/xxx
```

- add to **fstab**:

```Shell
UUID=xxx /data ext4 defaults,nofail 0 2
```

- reboot and check ownership again.
