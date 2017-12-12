
# overlay

Local and remote fallback HTTP proxy.

Work in progress: just an experiment for now.

# HTTPS

Create `key.pem` and `cert.pem` in the current directory:

```
openssl genrsa 2048 > key.pem
openssl req -x509 -new -key key.pem -days 9999 > cert.pem
```

