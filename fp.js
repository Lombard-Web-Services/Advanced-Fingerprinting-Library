// fp.js — Advanced Fingerprinting Library
// Pattern: Constructor + Prototype + Fluent Interface + Module Pattern
// 2026 compatible — No external dependencies
// By Thibaut LOMBARD (@LombardWeb)
// MIT License

(function(global) {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════════════
    // Private utilities (closure encapsulation)
    // ═══════════════════════════════════════════════════════════════════════
    
    const _private = {
        // Hashing constants (MurmurHash3 inspired)
        H1_SEED: 3735928559,  // 0xDEADBEEF
        H2_SEED: 1103547991,
        
        // Default configuration
        defaults: {
            length: 32,
            casing: 'lowercase', // 'lowercase' | 'uppercase' | 'mixed'
            scope: 'device',     // 'device' | 'browser' | 'session'
            includeCanvas: true,
            includeAudio: true,
            includeWebGL: false,
            includeFonts: false
        },
        
        // Utility: Deep extend (from Ninja patterns)
        extend: function(target, source) {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        },
        
        // Utility: Stable hash generation (64-bit)
        hash64: function(str) {
            let h1 = _private.H1_SEED;
            let h2 = _private.H2_SEED;
            
            for (let i = 0; i < str.length; i++) {
                const c = str.charCodeAt(i);
                h1 = Math.imul(h1 ^ c, 2654435761) >>> 0;
                h2 = Math.imul(h2 ^ c, 1597334677) >>> 0;
            }
            
            // Final mixing
            h1 ^= h1 >>> 16; h2 ^= h2 >>> 16;
            h1 = Math.imul(h1, 2246822507) >>> 0;
            h2 = Math.imul(h2, 3266489909) >>> 0;
            h1 ^= h1 >>> 13; h2 ^= h2 >>> 16;
            
            const combined = (BigInt(h1) << 32n) | BigInt(h2);
            return combined.toString(36);
        },
        
        // Utility: Format result based on casing preference
        format: function(hash, casing) {
            switch(casing) {
                case 'uppercase': return hash.toUpperCase();
                case 'mixed': 
                    // Alternating case for visual distinctiveness
                    return hash.split('').map((c, i) => 
                        i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()
                    ).join('');
                default: return hash.toLowerCase();
            }
        },
        
        // Utility: Truncate or pad to desired length
        normalizeLength: function(str, length) {
            if (str.length >= length) {
                return str.slice(0, length);
            }
            // Repeat pattern if too short
            return (str + str).slice(0, length);
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // Fingerprint Constructor (Ninja Class Pattern)
    // ═══════════════════════════════════════════════════════════════════════
    
    function Fingerprint(config) {
        // Allow instantiation without 'new' (defensive programming)
        if (!(this instanceof Fingerprint)) {
            return new Fingerprint(config);
        }
        
        // Initialize configuration
        this.config = _private.extend({}, _private.defaults);
        if (config) {
            _private.extend(this.config, config);
        }
        
        // Internal state
        this._data = [];
        this._collected = false;
        this._result = null;
        
        // Auto-collect if configured
        if (this.config.autoCollect !== false) {
            this.collect();
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // Prototype Methods (Fluent Interface Pattern)
    // ═══════════════════════════════════════════════════════════════════════
    
    Fingerprint.prototype = {
        constructor: Fingerprint,
        
        // ── Configuration Methods (Chainable) ─────────────────────────────
        
        /**
         * Set fingerprint length
         * @param {number} length - Desired length (8-64 recommended)
         * @returns {Fingerprint} this (for chaining)
         */
        length: function(len) {
            this.config.length = Math.max(8, Math.min(64, len));
            return this;
        },
        
        /**
         * Set casing style
         * @param {string} casing - 'lowercase' | 'uppercase' | 'mixed'
         * @returns {Fingerprint} this (for chaining)
         */
        casing: function(style) {
            const valid = ['lowercase', 'uppercase', 'mixed'];
            this.config.casing = valid.includes(style) ? style : 'lowercase';
            return this;
        },
        
        /**
         * Set scope/granularity
         * @param {string} scope - 'device' | 'browser' | 'session'
         * @returns {Fingerprint} this (for chaining)
         */
        scope: function(scopeType) {
            const valid = ['device', 'browser', 'session'];
            this.config.scope = valid.includes(scopeType) ? scopeType : 'device';
            return this;
        },
        
        /**
         * Enable/disable canvas fingerprinting
         * @param {boolean} enabled
         * @returns {Fingerprint} this (for chaining)
         */
        canvas: function(enabled) {
            this.config.includeCanvas = !!enabled;
            return this;
        },
        
        /**
         * Enable/disable audio fingerprinting
         * @param {boolean} enabled
         * @returns {Fingerprint} this (for chaining)
         */
        audio: function(enabled) {
            this.config.includeAudio = !!enabled;
            return this;
        },
        
        /**
         * Enable/disable WebGL fingerprinting
         * @param {boolean} enabled
         * @returns {Fingerprint} this (for chaining)
         */
        webgl: function(enabled) {
            this.config.includeWebGL = !!enabled;
            return this;
        },
        
        // ── Data Collection Methods ───────────────────────────────────────
        
        /**
         * Collect all fingerprint data
         * @returns {Fingerprint} this (for chaining)
         */
        collect: function() {
            this._data = [];
            
            // Scope-based collection strategy
            this._collectBasic();
            
            if (this.config.scope === 'device' || this.config.scope === 'browser') {
                this._collectHardware();
            }
            
            if (this.config.includeCanvas) {
                this._collectCanvas();
            }
            
            if (this.config.includeAudio) {
                this._collectAudio();
            }
            
            if (this.config.includeWebGL) {
                this._collectWebGL();
            }
            
            // Browser-specific entropy for 'browser' scope
            if (this.config.scope === 'browser') {
                this._collectBrowserSpecific();
            }
            
            this._collected = true;
            return this;
        },
        
        // ── Private Collection Helpers ────────────────────────────────────
        
        _collectBasic: function() {
            const nav = navigator;
            this._push('ua', nav.userAgent || nav.userAgentData?.uaFull || '');
            this._push('lang', nav.language || nav.languages?.join(',') || '');
            this._push('tz', Intl.DateTimeFormat().resolvedOptions().timeZone || '');
            this._push('tzOffset', new Date().getTimezoneOffset());
        },
        
        _collectHardware: function() {
            const nav = navigator;
            this._push('screen', `${screen.width}x${screen.height}x${screen.colorDepth || 24}`);
            this._push('availScreen', `${screen.availWidth}x${screen.availHeight}`);
            this._push('cores', nav.hardwareConcurrency || 'unknown');
            this._push('memory', nav.deviceMemory || 'unknown');
            this._push('touch', nav.maxTouchPoints || 0);
            this._push('platform', nav.platform || '');
        },
        
        _collectCanvas: function() {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 256; 
                canvas.height = 60;
                const ctx = canvas.getContext('2d');
                
                // Drawing operations
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.font = "11pt no-real-font-123";
                ctx.fillText("🦊 LombardWeb 2026 fingerprint 🖌", 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45);
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = "rgb(255,0,255)";
                ctx.beginPath(); 
                ctx.arc(50, 50, 50, 0, Math.PI * 2); 
                ctx.closePath(); 
                ctx.fill();
                
                this._push('canvas', canvas.toDataURL());
            } catch (e) {
                this._push('canvas', `error:${e.message}`);
            }
        },
        
        _collectAudio: async function() {
            try {
                const AudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                if (!AudioContext) {
                    this._push('audio', 'unsupported');
                    return;
                }
                
                const ctx = new AudioContext(1, 5000, 44100);
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = 10000;
                
                const comp = ctx.createDynamicsCompressor();
                comp.threshold.value = -50;
                comp.knee.value = 40;
                comp.ratio.value = 12;
                
                osc.connect(comp);
                comp.connect(ctx.destination);
                osc.start(0);
                
                const buffer = await ctx.startRendering();
                const channel = buffer.getChannelData(0);
                let hash = 0;
                
                for (let i = 4500; i < 5000; i += 3) {
                    hash = (hash << 5) - hash + Math.floor(channel[i] * 10000);
                }
                
                this._push('audio', `sig:${Math.abs(hash)}`);
            } catch (e) {
                this._push('audio', `error:${e.message}`);
            }
        },
        
        _collectWebGL: function() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) {
                    this._push('webgl', 'unsupported');
                    return;
                }
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    this._push('webglVendor', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
                    this._push('webglRenderer', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
                }
                this._push('webglParams', [
                    gl.getParameter(gl.VERSION),
                    gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    gl.getParameter(gl.VENDOR)
                ].join('|'));
            } catch (e) {
                this._push('webgl', `error:${e.message}`);
            }
        },
        
        _collectBrowserSpecific: function() {
            this._push('chrome', !!window.chrome);
            this._push('opr', !!window.opr);
            this._push('plugins', navigator.plugins?.length || 0);
            this._push('mimeTypes', navigator.mimeTypes?.length || 0);
            
            // User Agent Data (Chrome modern)
            if (navigator.userAgentData) {
                navigator.userAgentData.getHighEntropyValues([
                    "platform", "platformVersion", "architecture", "model"
                ]).then(hints => {
                    this._push('uaData', JSON.stringify(hints));
                }).catch(() => {});
            }
        },
        
        _push: function(key, value) {
            this._data.push(`${key}:${value}`);
        },
        
        // ── Generation Methods ────────────────────────────────────────────
        
        /**
         * Generate the final fingerprint hash
         * @returns {string} The fingerprint string
         */
		// Dans Fingerprint.prototype.generate, assurez-vous de stocker le résultat
		generate: function() {
			if (!this._collected) {
				this.collect();
			}
			
			const rawString = this._data.join('###');
			const hash = _private.hash64(rawString);
			const formatted = _private.format(hash, this.config.casing);
			this._result = _private.normalizeLength(formatted, this.config.length);
			
			// Retourne la string mais garde l'instance accessible
			return this._result;
		},
				
        /**
         * Get fingerprint asynchronously (for audio/canvas async operations)
         * @returns {Promise<string>}
         */
        generateAsync: async function() {
            // Ensure audio collection completes if pending
            if (this.config.includeAudio && !this._collected) {
                await this.collect();
            }
            return this.generate();
        },
        
        /**
         * Get raw data components (for debugging)
         * @returns {Array} Raw fingerprint components
         */
        raw: function() {
            return this._data.slice();
        },
        
        /**
         * Get last generated result
         * @returns {string|null}
         */
        get: function() {
            return this._result;
        },
        
        /**
         * Reset for re-collection
         * @returns {Fingerprint} this (for chaining)
         */
        reset: function() {
            this._data = [];
            this._collected = false;
            this._result = null;
            return this;
        },
        
        /**
         * Compare with another fingerprint
         * @param {string} otherFingerprint 
         * @returns {number} Similarity score (0-1)
         */
        compare: function(otherFingerprint) {
            if (!this._result) this.generate();
            if (!otherFingerprint || otherFingerprint.length !== this._result.length) {
                return 0;
            }
            
            let matches = 0;
            for (let i = 0; i < this._result.length; i++) {
                if (this._result[i] === otherFingerprint[i]) matches++;
            }
            return matches / this._result.length;
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // Static Factory Methods (Ninja Pattern)
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Quick fingerprint generation (static method)
     * @param {Object} config Optional configuration
     * @returns {string} Fingerprint
     */
    Fingerprint.generate = function(config) {
        return new Fingerprint(config).generate();
    };
    
    /**
     * Async fingerprint generation
     * @param {Object} config Optional configuration
     * @returns {Promise<string>}
     */
    Fingerprint.generateAsync = async function(config) {
        return new Fingerprint(config).generateAsync();
    };
    
    /**
     * Create pre-configured instances (Fluent Factory)
     */
    Fingerprint.device = function() {
        return new Fingerprint({ scope: 'device' });
    };
    
    Fingerprint.browser = function() {
        return new Fingerprint({ scope: 'browser' });
    };
    
    Fingerprint.session = function() {
        return new Fingerprint({ scope: 'session' });
    };
    // ═══════════════════════════════════════════════════════════════════════
	// Static Comparison Method (à ajouter après Fingerprint.generateAsync)
	// ═══════════════════════════════════════════════════════════════════════

	/**
	 * Compare two fingerprint strings
	 * @param {string} fp1 - First fingerprint
	 * @param {string} fp2 - Second fingerprint  
	 * @returns {number} Similarity ratio (0.0 to 1.0)
	 */
	Fingerprint.compare = function(fp1, fp2) {
		if (!fp1 || !fp2 || fp1.length !== fp2.length) return 0;
		let matches = 0;
		const len = Math.min(fp1.length, fp2.length);
		for (let i = 0; i < len; i++) {
			if (fp1[i] === fp2[i]) matches++;
		}
		return matches / len;
	};
	
    // ═══════════════════════════════════════════════════════════════════════
    // Export (Universal Module Pattern)
    // ═══════════════════════════════════════════════════════════════════════
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Fingerprint;
    } else {
        global.Fingerprint = Fingerprint;
        // Backward compatibility
        global.generateUnifiedFingerprint = function() {
            return Fingerprint.generateAsync();
        };
    }
    
})(typeof window !== 'undefined' ? window : this);
