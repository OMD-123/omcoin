import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserProvider, Contract, formatUnits, isAddress, parseUnits } from 'ethers';
import './styles.css';

const contractAddress = '0x2745F1De48D978523b9F9357fB8BF3BFDee5E53F';
const sepoliaChainId = '0xaa36a7';
const contractAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function App() {
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(18);
  const [token, setToken] = useState({ name: 'OmCoin', symbol: 'OMC' });
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Connect a wallet to view your OMC balance.');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activity, setActivity] = useState(() => JSON.parse(localStorage.getItem('omcoin_activity') || '[]'));

  async function getContract() {
    const provider = new BrowserProvider(window.ethereum);
    const code = await provider.getCode(contractAddress);
    if (code === '0x') throw new Error('No OmCoin contract found at this address on Sepolia.');
    return { provider, contract: new Contract(contractAddress, contractAbi, provider) };
  }

  async function loadWallet(address) {
    const { contract } = await getContract();
    const [rawBalance, tokenDecimals, name, symbol] = await Promise.all([
      contract.balanceOf(address), contract.decimals(), contract.name(), contract.symbol(),
    ]);
    setDecimals(Number(tokenDecimals));
    setBalance(formatUnits(rawBalance, tokenDecimals));
    setToken({ name, symbol });
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus('No browser wallet found. Install MetaMask to connect.');
      return;
    }
    try {
      setLoading(true);
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId.toLowerCase() !== sepoliaChainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
      }
      const provider = new BrowserProvider(window.ethereum);
      const [address] = await provider.send('eth_requestAccounts', []);
      await loadWallet(address);
      setWallet(address);
      setStatus('Wallet connected');
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || 'Unable to connect to the wallet.');
    } finally {
      setLoading(false);
    }
  }

  async function refreshBalance() {
    if (!wallet) return connectWallet();
    try {
      setRefreshing(true);
      await loadWallet(wallet);
      setStatus('Balance updated');
    } catch (error) {
      setStatus(error?.shortMessage || 'Could not refresh balance.');
    } finally {
      setRefreshing(false);
    }
  }

  async function handleTransfer(event) {
    event.preventDefault();
    if (!wallet) return setStatus('Connect your wallet first.');
    if (!isAddress(recipient)) return setStatus('Enter a valid recipient address.');
    if (!amount || Number(amount) <= 0) return setStatus('Enter an amount greater than zero.');
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);
      const tx = await contract.transfer(recipient, parseUnits(amount, decimals));
      setStatus('Confirming transaction...');
      await tx.wait();
      const nextActivity = [{ recipient, amount, hash: tx.hash, time: Date.now() }, ...activity].slice(0, 4);
      setActivity(nextActivity);
      localStorage.setItem('omcoin_activity', JSON.stringify(nextActivity));
      setRecipient('');
      setAmount('');
      await loadWallet(wallet);
      setStatus('Transaction complete');
    } catch (error) {
      setStatus(error?.shortMessage || error?.reason || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function disconnectWallet() {
    setWallet('');
    setBalance(null);
    setStatus('Wallet disconnected');
  }

  useEffect(() => {
    if (!window.ethereum) return undefined;
    const handleAccounts = (accounts) => accounts[0] ? connectWallet() : disconnectWallet();
    window.ethereum.on('accountsChanged', handleAccounts);
    window.ethereum.on('chainChanged', () => window.location.reload());
    return () => window.ethereum.removeListener('accountsChanged', handleAccounts);
  }, []);

  const displayBalance = balance === null ? '0.00' : Number(balance).toLocaleString(undefined, { maximumFractionDigits: 4 });

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="fox-mark">O</span><span>OMCOIN</span></div><div className="top-actions"><span className="network"><i /> Sepolia</span>{wallet && <button className="account-pill" onClick={copyAddress}>{copied ? 'Copied!' : shortAddress(wallet)} <span>⌄</span></button>}</div></header>
      <section className="wallet-card"><div className="wallet-heading"><span>Portfolio</span><button className="icon-button" onClick={refreshBalance} aria-label="Refresh balance">{refreshing ? '...' : '↻'}</button></div><div className="balance-label">TOTAL BALANCE</div><div className="balance-value">{displayBalance} <small>{token.symbol}</small></div><div className="balance-sub">{balance ? '$0.00 USD' : 'Connect to view your balance'}</div><div className="quick-actions"><button onClick={connectWallet} disabled={loading}><span className="action-icon">↓</span><b>{wallet ? 'Connected' : 'Connect'}</b></button><button onClick={() => document.getElementById('send-panel').scrollIntoView({ behavior: 'smooth' })}><span className="action-icon">↑</span><b>Send</b></button><button onClick={() => window.open(`https://sepolia.etherscan.io/token/${contractAddress}`, '_blank')}><span className="action-icon">↗</span><b>Explore</b></button></div></section>
      <section className="content-grid"><form className="panel send-panel" id="send-panel" onSubmit={handleTransfer}><div className="panel-title"><span>Send {token.symbol}</span><span className="panel-kicker">ON SEPOLIA</span></div><label>TO</label><input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x recipient address" spellCheck="false" /><div className="amount-label"><label>AMOUNT</label><button type="button" onClick={() => setAmount(balance || '')}>Max: {displayBalance} {token.symbol}</button></div><div className="amount-input"><input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" type="number" min="0" step="any" /><span>{token.symbol}</span></div><button className="send-button" disabled={loading || !wallet}>{loading ? 'Processing...' : wallet ? 'Review transaction' : 'Connect wallet to send'}</button><p className="form-status">{status}</p></form><section className="panel activity-panel"><div className="panel-title"><span>Activity</span><span className="panel-kicker">LATEST</span></div>{activity.length === 0 ? <div className="empty-state"><span>◌</span><b>No recent activity</b><p>Your transfers will appear here.</p></div> : activity.map((item) => <a className="activity-row" href={`https://sepolia.etherscan.io/tx/${item.hash}`} target="_blank" rel="noreferrer" key={item.hash}><span className="activity-icon">↑</span><span><b>Sent {item.amount} {token.symbol}</b><small>To {shortAddress(item.recipient)}</small></span><strong>↗</strong></a>)}</section></section>
      <footer><span>OMCOIN WALLET</span><button onClick={disconnectWallet}>Disconnect</button><span>{contractAddress ? `${contractAddress.slice(0, 8)}...${contractAddress.slice(-6)}` : 'Contract not configured'}</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
